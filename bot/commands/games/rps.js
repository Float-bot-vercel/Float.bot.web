const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play rock, paper, scissors against the bot'),
  
  async execute(interaction) {
    // Create buttons for rock, paper, scissors
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('rock')
          .setLabel('🪨 Rock')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('paper')
          .setLabel('📄 Paper')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('scissors')
          .setLabel('✂️ Scissors')
          .setStyle(ButtonStyle.Primary)
      );
    
    // Create the initial embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('Rock, Paper, Scissors')
      .setDescription('Click a button to make your choice!')
      .setFooter({ text: 'Float Bot • Game: Rock, Paper, Scissors' });
    
    // Send the message with the buttons
    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });
    
    // Create a filter for the button interaction collector
    const filter = i => {
      return i.user.id === interaction.user.id && ['rock', 'paper', 'scissors'].includes(i.customId);
    };
    
    // Start the collector
    const collector = message.createMessageComponentCollector({ filter, time: 30000 });
    
    collector.on('collect', async i => {
      // Get player's choice
      const playerChoice = i.customId;
      
      // Bot makes a random choice
      const choices = ['rock', 'paper', 'scissors'];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      
      // Determine the winner
      let result;
      if (playerChoice === botChoice) {
        result = "It's a tie!";
      } else if (
        (playerChoice === 'rock' && botChoice === 'scissors') ||
        (playerChoice === 'paper' && botChoice === 'rock') ||
        (playerChoice === 'scissors' && botChoice === 'paper')
      ) {
        result = 'You win!';
      } else {
        result = 'You lose!';
      }
      
      // Emoji representations
      const emojiMap = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
      };
      
      // Update the embed with the results
      const resultEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('Rock, Paper, Scissors - Results')
        .addFields(
          { name: 'Your Choice', value: `${emojiMap[playerChoice]} ${playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)}`, inline: true },
          { name: 'Bot\'s Choice', value: `${emojiMap[botChoice]} ${botChoice.charAt(0).toUpperCase() + botChoice.slice(1)}`, inline: true },
          { name: 'Result', value: result, inline: false }
        )
        .setFooter({ text: 'Float Bot • Game: Rock, Paper, Scissors' });
      
      // Disable all buttons
      const disabledRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('🪨 Rock')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('📄 Paper')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('✂️ Scissors')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );
      
      // Update the message with the results
      await i.update({
        embeds: [resultEmbed],
        components: [disabledRow]
      });
      
      // End the collector
      collector.stop();
    });
    
    collector.on('end', async (collected, reason) => {
      if (reason === 'time' && collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('Game Timed Out')
          .setDescription('You took too long to make a choice!')
          .setFooter({ text: 'Float Bot • Game: Rock, Paper, Scissors' });
        
        const disabledRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('rock')
              .setLabel('🪨 Rock')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('paper')
              .setLabel('📄 Paper')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true),
            new ButtonBuilder()
              .setCustomId('scissors')
              .setLabel('✂️ Scissors')
              .setStyle(ButtonStyle.Primary)
              .setDisabled(true)
          );
        
        await interaction.editReply({
          embeds: [timeoutEmbed],
          components: [disabledRow]
        });
      }
    });
  },
  category: 'games'
};