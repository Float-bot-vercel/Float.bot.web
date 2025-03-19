const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin'),
  
  async execute(interaction) {
    // Send initial message
    const initialEmbed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🪙 Coin Flip')
      .setDescription('Flipping the coin...')
      .setFooter({ text: 'Float Bot • Game: Coin Flip' });
    
    await interaction.reply({ embeds: [initialEmbed] });
    
    // Simulate coin flip delay
    setTimeout(async () => {
      // Determine the result (50/50 chance for heads or tails)
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      
      // Create result embed
      const resultEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🪙 Coin Flip')
        .setDescription(`The coin landed on: **${result}**!`)
        .setImage(result === 'Heads' ? 'https://i.imgur.com/HAvGDxX.png' : 'https://i.imgur.com/9VkanJD.png')
        .setFooter({ text: 'Float Bot • Game: Coin Flip' });
      
      await interaction.editReply({ embeds: [resultEmbed] });
    }, 1500); // 1.5 seconds delay
  },
  category: 'games'
};