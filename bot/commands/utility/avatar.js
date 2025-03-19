const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Displays a user\'s avatar')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user whose avatar to display')
        .setRequired(false)),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`${user.username}'s Avatar`)
      .setDescription(`[PNG](${user.displayAvatarURL({ format: 'png', size: 2048 })}) | [JPG](${user.displayAvatarURL({ format: 'jpg', size: 2048 })}) | [WEBP](${user.displayAvatarURL({ format: 'webp', size: 2048 })})`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setFooter({ text: 'Float Bot • Avatar Display' });
    
    await interaction.reply({ embeds: [embed] });
  },
  category: 'utility'
};