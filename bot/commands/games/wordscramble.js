const { SlashCommandBuilder } = require('discord.js');
const wordScrambleGame = require('../../games/wordscramble.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordscramble')
    .setDescription('Play a word unscrambling game with various categories'),
  
  async execute(interaction) {
    // Execute the word scramble game
    await wordScrambleGame.execute(interaction);
  },
  category: 'games'
};