const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'guess',
  description: 'Guess the random number between 1 and 100',
  
  async execute(interaction) {
    // Generate a random number between 1 and 100
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    
    // Game state
    const gameState = {
      targetNumber,
      attempts: 0,
      maxAttempts: 10,
      lowGuess: 0,
      highGuess: 101,
      lastGuess: null,
      gameOver: false,
      won: false
    };
    
    // Function to create hint buttons
    function createHintButtons() {
      const buttons = [];
      
      // Create buttons for different ranges based on current game state
      const ranges = getGuessRanges();
      
      for (let i = 0; i < Math.min(ranges.length, 5); i++) {
        const range = ranges[i];
        buttons.push(
          new ButtonBuilder()
            .setCustomId(`guess_${range.value}`)
            .setLabel(`${range.label}`)
            .setStyle(ButtonStyle.Primary)
        );
      }
      
      return buttons;
    }
    
    // Function to get guess ranges based on current high/low boundaries
    function getGuessRanges() {
      const low = gameState.lowGuess;
      const high = gameState.highGuess;
      const range = high - low - 1;
      
      if (range <= 5) {
        // If range is small, show all numbers
        const ranges = [];
        for (let i = low + 1; i < high; i++) {
          ranges.push({ value: i, label: `${i}` });
        }
        return ranges;
      }
      
      // Otherwise, split the range into chunks
      const chunk = Math.max(Math.floor(range / 5), 1);
      const ranges = [];
      
      for (let i = 1; i <= 5; i++) {
        const value = low + (chunk * i) - Math.floor(chunk / 2);
        
        // Ensure we stay within the valid range
        if (value > low && value < high) {
          let label;
          
          if (i === 1) {
            label = `${low+1}-${value+Math.floor(chunk/2)}`;
          } else if (i === 5) {
            label = `${value-Math.floor(chunk/2)}-${high-1}`;
          } else {
            label = `~${value}`;
          }
          
          ranges.push({ value, label });
        }
      }
      
      return ranges;
    }
    
    // Function to update the game message
    async function updateGameMessage() {
      // Create the embed
      const embed = new EmbedBuilder()
        .setTitle('Number Guessing Game 🔢')
        .setColor(gameState.gameOver ? (gameState.won ? '#00FF00' : '#FF0000') : '#5865F2');
      
      if (gameState.gameOver) {
        // Game over embed
        embed.setDescription(
          gameState.won
            ? `🎉 **You won!** You guessed the number **${gameState.targetNumber}** in ${gameState.attempts} attempts!`
            : `😢 **Game over!** You've used all ${gameState.maxAttempts} attempts. The number was **${gameState.targetNumber}**.`
        );
      } else {
        // Game in progress embed
        let description = `Guess a number between **${gameState.lowGuess + 1}** and **${gameState.highGuess - 1}**\n`;
        description += `Attempts remaining: **${gameState.maxAttempts - gameState.attempts}** of ${gameState.maxAttempts}\n\n`;
        
        if (gameState.lastGuess !== null) {
          if (gameState.lastGuess < gameState.targetNumber) {
            description += `Your last guess (**${gameState.lastGuess}**) was **too low**! 📉\n`;
          } else {
            description += `Your last guess (**${gameState.lastGuess}**) was **too high**! 📈\n`;
          }
        }
        
        embed.setDescription(description);
      }
      
      // Create button rows
      const rows = [];
      
      if (!gameState.gameOver) {
        // Split buttons into rows if needed
        const buttons = createHintButtons();
        for (let i = 0; i < buttons.length; i += 5) {
          const row = new ActionRowBuilder();
          const rowButtons = buttons.slice(i, i + 5);
          row.addComponents(...rowButtons);
          rows.push(row);
        }
      } else {
        // Game over, show play again button
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('guess_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
          );
        rows.push(row);
      }
      
      return { embeds: [embed], components: rows };
    }
    
    // Send the initial game message
    const initialMessage = await updateGameMessage();
    const message = await interaction.reply({
      ...initialMessage,
      fetchReply: true
    });
    
    // Create collector for button interactions
    const filter = i => i.user.id === interaction.user.id && 
                       (i.customId.startsWith('guess_') || i.customId === 'guess_play_again');
    
    const collector = message.createMessageComponentCollector({ filter, time: 180000 }); // 3 minutes
    
    // Handle button presses
    collector.on('collect', async i => {
      if (i.customId === 'guess_play_again') {
        // Start a new game
        collector.stop();
        await this.execute(interaction);
        return;
      }
      
      // Get the guessed number
      const guess = parseInt(i.customId.replace('guess_', ''));
      gameState.lastGuess = guess;
      gameState.attempts++;
      
      // Check if the guess is correct
      if (guess === gameState.targetNumber) {
        gameState.gameOver = true;
        gameState.won = true;
      } else {
        // Update the range
        if (guess < gameState.targetNumber) {
          gameState.lowGuess = Math.max(gameState.lowGuess, guess);
        } else {
          gameState.highGuess = Math.min(gameState.highGuess, guess);
        }
        
        // Check if max attempts reached
        if (gameState.attempts >= gameState.maxAttempts) {
          gameState.gameOver = true;
        }
        
        // Check if there's only one possible number left
        if (gameState.highGuess - gameState.lowGuess === 2) {
          gameState.targetNumber = gameState.lowGuess + 1;
          gameState.gameOver = true;
          gameState.won = true;
        }
      }
      
      // Update the message
      const updatedMessage = await updateGameMessage();
      await i.update(updatedMessage);
      
      // Stop the collector if the game is over
      if (gameState.gameOver) {
        collector.resetTimer({ time: 60000 }); // Give 1 minute to press "Play Again"
      }
    });
    
    // Handle collector end
    collector.on('end', async collected => {
      if (collected.size === 0 || (!gameState.gameOver && collected.size > 0)) {
        // Game timed out
        gameState.gameOver = true;
        
        const timeoutEmbed = new EmbedBuilder()
          .setTitle('Number Guessing Game 🔢')
          .setColor('#FF0000')
          .setDescription(`⏱️ **Time's up!** The game has ended due to inactivity. The number was **${gameState.targetNumber}**.`);
        
        // Create a play again button
        const actionRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('guess_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true) // Disabled because the collector has ended
          );
        
        await message.edit({ embeds: [timeoutEmbed], components: [actionRow] });
      }
    });
  }
};