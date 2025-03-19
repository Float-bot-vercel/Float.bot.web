const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Checks the bot\'s latency and API response time'),
  
  async execute(interaction, client) {
    const sent = await interaction.deferReply({ fetchReply: true });
    const ping = sent.createdTimestamp - interaction.createdTimestamp;
    
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot Latency', value: `${ping}ms`, inline: true },
        { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true }
      )
      .setFooter({ text: 'Float Bot • Response Time Test' });
    
    await interaction.editReply({ embeds: [embed] });
  },
  category: 'utility'
};