const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the current server'),
  
  async execute(interaction) {
    const { guild } = interaction;
    
    // Get guild information
    const memberCount = guild.memberCount;
    const textChannels = guild.channels.cache.filter(ch => ch.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(ch => ch.type === 2).size;
    const categoryChannels = guild.channels.cache.filter(ch => ch.type === 4).size;
    const guildRoles = guild.roles.cache.size;
    const creationDate = guild.createdAt.toLocaleDateString();
    const boostCount = guild.premiumSubscriptionCount;
    const boostLevel = guild.premiumTier;
    
    // Server verification level
    const verificationLevels = {
      0: 'None',
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High'
    };
    
    // Build and send embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: 'Server ID', value: guild.id, inline: true },
        { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Created On', value: creationDate, inline: true },
        { name: 'Members', value: `${memberCount}`, inline: true },
        { name: 'Boost Level', value: `Level ${boostLevel} (${boostCount} boosts)`, inline: true },
        { name: 'Verification Level', value: verificationLevels[guild.verificationLevel], inline: true },
        { name: 'Channels', value: `📝 Text: ${textChannels}\n🔊 Voice: ${voiceChannels}\n📂 Categories: ${categoryChannels}`, inline: true },
        { name: 'Roles', value: `${guildRoles}`, inline: true }
      )
      .setFooter({ text: 'Float Bot • Server Information' });
    
    await interaction.reply({ embeds: [embed] });
  },
  category: 'utility'
};