const { SlashCommandBuilder } = require('discord.js');
const triviaGame = require('../../games/trivia.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Play a trivia game with random questions'),
  
  async execute(interaction) {
    // Execute the trivia game
    await triviaGame.execute(interaction);
  },
  category: 'games'
};