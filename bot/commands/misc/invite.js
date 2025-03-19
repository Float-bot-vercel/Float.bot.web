const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get invite links for the bot and support server'),
  
  async execute(interaction, client) {
    // Create the embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('Invite Float Bot')
      .setDescription('Thank you for your interest in Float Bot! Use the buttons below to invite the bot to your server or join our support server.')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Why Choose Float Bot?', value: 'Float Bot offers a wide range of features including utility commands, fun interactions, mini-games, and powerful moderation tools to enhance your Discord server experience.' },
        { name: 'Commands', value: 'Use `/help` to see a list of all available commands.' },
        { name: 'Support', value: 'If you need help or have suggestions, join our support server using the button below.' }
      )
      .setFooter({ text: 'Float Bot • Your all-in-one Discord bot solution' });
    
    // Create invite buttons
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Add to Server')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.com/oauth2/authorize?client_id=1351863223753904148&permissions=8&integration_type=0&scope=bot')
          .setEmoji('🤖'),
        new ButtonBuilder()
          .setLabel('Support Server')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/6RXCUjgqUH')
          .setEmoji('🛠️'),
        new ButtonBuilder()
          .setLabel('Website')
          .setStyle(ButtonStyle.Link)
          .setURL('https://float-bot.replit.app')
          .setEmoji('🌐')
      );
    
    await interaction.reply({ embeds: [embed], components: [row] });
  },
  category: 'misc'
};