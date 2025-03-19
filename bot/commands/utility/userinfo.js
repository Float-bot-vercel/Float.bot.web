const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays information about a user')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to get information about')
        .setRequired(false)),
  
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    
    // If member isn't found in the guild
    if (!member) {
      const userEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`User Info: ${targetUser.username}`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 1024 }))
        .addFields(
          { name: 'User ID', value: targetUser.id, inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: 'This user is not a member of this server' });
      
      return interaction.reply({ embeds: [userEmbed] });
    }
    
    // Get user roles (excluding @everyone)
    const roles = member.roles.cache
      .filter(role => role.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(role => `<@&${role.id}>`)
      .join(', ') || 'None';
    
    // Get user status (online, idle, dnd, offline)
    const status = {
      online: '🟢 Online',
      idle: '🟡 Idle',
      dnd: '🔴 Do Not Disturb',
      offline: '⚪ Offline'
    };
    const userStatus = status[member.presence?.status || 'offline'];
    
    // Build and send embed
    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor === '#000000' ? '#5865F2' : member.displayHexColor)
      .setTitle(`User Info: ${member.user.username}`)
      .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: 'User ID', value: member.id, inline: true },
        { name: 'Nickname', value: member.nickname || 'None', inline: true },
        { name: 'Status', value: userStatus, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: `Roles [${member.roles.cache.size - 1}]`, value: roles.length > 1024 ? `${roles.substring(0, 1020)}...` : roles }
      )
      .setFooter({ text: 'Float Bot • User Information' });
    
    await interaction.reply({ embeds: [embed] });
  },
  category: 'utility'
};