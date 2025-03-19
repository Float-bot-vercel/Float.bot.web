const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user from the server')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for the kick')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  async execute(interaction) {
    // Get command options
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    // Check if bot has permission to kick members
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: 'I don\'t have permission to kick members!',
        ephemeral: true
      });
    }
    
    try {
      // Get the target member from the guild
      const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
      
      // Check if the target member exists in the guild
      if (!targetMember) {
        return interaction.reply({
          content: 'This user is not in the server!',
          ephemeral: true
        });
      }
      
      // Check if the target is kickable
      if (!targetMember.kickable) {
        return interaction.reply({
          content: `I cannot kick ${targetUser.tag}! Their role may be higher than mine or they may have kick permissions.`,
          ephemeral: true
        });
      }
      
      // Check if the command user's role is higher than the target's role
      if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
        return interaction.reply({
          content: `You cannot kick ${targetUser.tag}! Their role is higher than or equal to yours.`,
          ephemeral: true
        });
      }
      
      // Kick the user
      await targetMember.kick(`${reason} (Kicked by ${interaction.user.tag})`);
      
      // Create and send the success embed
      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('User Kicked')
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Kicked User', value: `${targetUser.tag} (${targetUser.id})` },
          { name: 'Kicked By', value: interaction.user.tag },
          { name: 'Reason', value: reason }
        )
        .setTimestamp()
        .setFooter({ text: 'Float Bot • Moderation Action' });
      
      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Error in kick command:', error);
      return interaction.reply({
        content: `An error occurred while trying to kick the user: ${error.message}`,
        ephemeral: true
      });
    }
  },
  category: 'moderation'
};