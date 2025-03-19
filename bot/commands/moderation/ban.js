const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for the ban')
        .setRequired(false))
    .addIntegerOption(option => 
      option.setName('days')
        .setDescription('Number of days of messages to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  async execute(interaction) {
    // Get command options
    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const deleteMessageDays = interaction.options.getInteger('days') || 0;
    
    // Check if bot has permission to ban members
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: 'I don\'t have permission to ban members!',
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
      
      // Check if the target is bannable
      if (!targetMember.bannable) {
        return interaction.reply({
          content: `I cannot ban ${targetUser.tag}! Their role may be higher than mine or they may have ban permissions.`,
          ephemeral: true
        });
      }
      
      // Check if the command user's role is higher than the target's role
      if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
        return interaction.reply({
          content: `You cannot ban ${targetUser.tag}! Their role is higher than or equal to yours.`,
          ephemeral: true
        });
      }
      
      // Ban the user
      await interaction.guild.members.ban(targetUser, {
        deleteMessageDays: deleteMessageDays,
        reason: `${reason} (Banned by ${interaction.user.tag})`
      });
      
      // Create and send the success embed
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('User Banned')
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Banned User', value: `${targetUser.tag} (${targetUser.id})` },
          { name: 'Banned By', value: interaction.user.tag },
          { name: 'Reason', value: reason },
          { name: 'Message History Deleted', value: `${deleteMessageDays} days` }
        )
        .setTimestamp()
        .setFooter({ text: 'Float Bot • Moderation Action' });
      
      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Error in ban command:', error);
      return interaction.reply({
        content: `An error occurred while trying to ban the user: ${error.message}`,
        ephemeral: true
      });
    }
  },
  category: 'moderation'
};