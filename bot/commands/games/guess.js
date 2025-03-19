const { SlashCommandBuilder } = require('discord.js');
const guessGame = require('../../games/guess.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('guess')
    .setDescription('Play a number guessing game (1-100)'),
  
  async execute(interaction) {
    // Execute the guessing game
    await guessGame.execute(interaction);
  },
  category: 'games'
};