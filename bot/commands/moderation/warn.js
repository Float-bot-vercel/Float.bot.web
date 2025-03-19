const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// In-memory storage for warnings
// In a production environment, this would be stored in a database
const warningSystem = {
  warnings: new Map(), // Map of guild ID -> Map of user ID -> array of warnings
  
  // Add a warning to a user
  addWarning(guildId, userId, reason, moderatorId, moderatorTag) {
    if (!this.warnings.has(guildId)) {
      this.warnings.set(guildId, new Map());
    }
    
    const guildWarnings = this.warnings.get(guildId);
    
    if (!guildWarnings.has(userId)) {
      guildWarnings.set(userId, []);
    }
    
    const userWarnings = guildWarnings.get(userId);
    
    const warning = {
      reason,
      timestamp: Date.now(),
      moderatorId,
      moderatorTag
    };
    
    userWarnings.push(warning);
    return userWarnings.length;
  },
  
  // Get all warnings for a user
  getWarnings(guildId, userId) {
    if (!this.warnings.has(guildId)) {
      return [];
    }
    
    const guildWarnings = this.warnings.get(guildId);
    
    if (!guildWarnings.has(userId)) {
      return [];
    }
    
    return guildWarnings.get(userId);
  },
  
  // Remove a specific warning
  removeWarning(guildId, userId, index) {
    if (!this.warnings.has(guildId)) {
      return false;
    }
    
    const guildWarnings = this.warnings.get(guildId);
    
    if (!guildWarnings.has(userId)) {
      return false;
    }
    
    const userWarnings = guildWarnings.get(userId);
    
    if (index < 0 || index >= userWarnings.length) {
      return false;
    }
    
    userWarnings.splice(index, 1);
    return true;
  },
  
  // Clear all warnings for a user
  clearWarnings(guildId, userId) {
    if (!this.warnings.has(guildId)) {
      return false;
    }
    
    const guildWarnings = this.warnings.get(guildId);
    
    if (!guildWarnings.has(userId)) {
      return false;
    }
    
    guildWarnings.delete(userId);
    return true;
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Manage warnings for users')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Warn a user')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('The user to warn')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('reason')
            .setDescription('The reason for the warning')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List warnings for a user')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('The user to check warnings for')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a specific warning')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('The user to remove a warning from')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('index')
            .setDescription('The index of the warning to remove (see /warn list)')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('clear')
        .setDescription('Clear all warnings for a user')
        .addUserOption(option => 
          option.setName('user')
            .setDescription('The user to clear warnings for')
            .setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    // Check if the user has permission
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true
      });
    }
    
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;
    
    if (subcommand === 'add') {
      const reason = interaction.options.getString('reason');
      const moderatorId = interaction.user.id;
      const moderatorTag = interaction.user.tag;
      
      // Check if trying to warn self
      if (user.id === interaction.user.id) {
        return interaction.reply({
          content: 'You cannot warn yourself.',
          ephemeral: true
        });
      }
      
      // Check if trying to warn a bot
      if (user.bot) {
        return interaction.reply({
          content: 'You cannot warn bots.',
          ephemeral: true
        });
      }
      
      // Add the warning
      const warningCount = warningSystem.addWarning(guildId, user.id, reason, moderatorId, moderatorTag);
      
      // Create an embed for the warning
      const warnEmbed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('User Warned')
        .addFields(
          { name: 'User', value: `${user.tag} (${user.id})` },
          { name: 'Reason', value: reason },
          { name: 'Warning Count', value: `This user now has ${warningCount} warning(s)` },
          { name: 'Moderator', value: interaction.user.tag }
        )
        .setTimestamp();
      
      // Send the warning embed
      await interaction.reply({ embeds: [warnEmbed] });
      
      // Try to DM the user
      try {
        const dmEmbed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle(`You have been warned in ${interaction.guild.name}`)
          .addFields(
            { name: 'Reason', value: reason },
            { name: 'Warning Count', value: `You now have ${warningCount} warning(s)` },
            { name: 'Moderator', value: interaction.user.tag }
          )
          .setTimestamp();
        
        await user.send({ embeds: [dmEmbed] });
      } catch (error) {
        // If we can't DM the user, ignore the error
        console.error(`Could not DM user ${user.tag}: ${error}`);
      }
      
      // If the user has reached a certain threshold of warnings, take additional action
      if (warningCount === 3) {
        // Try to timeout the user for 1 hour
        try {
          const member = await interaction.guild.members.fetch(user.id);
          if (member) {
            await member.timeout(60 * 60 * 1000, 'Received 3 warnings'); // 1 hour timeout
            
            const timeoutEmbed = new EmbedBuilder()
              .setColor('#FF0000')
              .setTitle('User Timed Out')
              .setDescription(`${user.tag} has been automatically timed out for 1 hour after receiving 3 warnings.`)
              .setTimestamp();
            
            await interaction.followUp({ embeds: [timeoutEmbed] });
          }
        } catch (error) {
          console.error(`Could not timeout user ${user.tag}: ${error}`);
          
          // Inform the moderator that we couldn't timeout the user
          await interaction.followUp({
            content: `Could not automatically timeout ${user.tag} after 3 warnings. Please check my permissions.`,
            ephemeral: true
          });
        }
      }
    } else if (subcommand === 'list') {
      const warnings = warningSystem.getWarnings(guildId, user.id);
      
      if (warnings.length === 0) {
        return interaction.reply({
          content: `${user.tag} has no warnings.`,
          ephemeral: true
        });
      }
      
      // Create an embed for the warnings
      const listEmbed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`Warnings for ${user.tag}`)
        .setDescription(`Total warnings: ${warnings.length}`)
        .setTimestamp();
      
      // Add each warning as a field
      warnings.forEach((warning, index) => {
        const date = new Date(warning.timestamp);
        listEmbed.addFields({
          name: `Warning #${index + 1}`,
          value: `**Reason:** ${warning.reason}\n` +
                 `**Moderator:** ${warning.moderatorTag}\n` +
                 `**Date:** <t:${Math.floor(warning.timestamp / 1000)}:F>`
        });
      });
      
      await interaction.reply({ embeds: [listEmbed], ephemeral: true });
    } else if (subcommand === 'remove') {
      const index = interaction.options.getInteger('index') - 1; // Convert to 0-based index
      const success = warningSystem.removeWarning(guildId, user.id, index);
      
      if (!success) {
        return interaction.reply({
          content: `Invalid warning index for ${user.tag}. Use /warn list to see available warnings.`,
          ephemeral: true
        });
      }
      
      const remainingWarnings = warningSystem.getWarnings(guildId, user.id).length;
      
      // Create an embed for the removal
      const removeEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Warning Removed')
        .setDescription(`Warning #${index + 1} has been removed from ${user.tag}.\nRemaining warnings: ${remainingWarnings}`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [removeEmbed], ephemeral: false });
    } else if (subcommand === 'clear') {
      const success = warningSystem.clearWarnings(guildId, user.id);
      
      if (!success) {
        return interaction.reply({
          content: `${user.tag} already has no warnings.`,
          ephemeral: true
        });
      }
      
      // Create an embed for the clearing
      const clearEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Warnings Cleared')
        .setDescription(`All warnings have been cleared for ${user.tag}.`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [clearEmbed], ephemeral: false });
    }
  },
  category: 'moderation'
};