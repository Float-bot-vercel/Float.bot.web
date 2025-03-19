const { SlashCommandBuilder } = require('discord.js');
const hangmanGame = require('../../games/hangman.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Play a game of hangman with various word categories'),
  
  async execute(interaction) {
    // Execute the hangman game
    await hangmanGame.execute(interaction);
  },
  category: 'games'
};