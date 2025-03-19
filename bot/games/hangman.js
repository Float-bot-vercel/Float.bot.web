const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'hangman',
  description: 'Play a game of hangman',
  
  async execute(interaction) {
    // Word categories and words
    const categories = {
      'Animals': ['ELEPHANT', 'TIGER', 'DOLPHIN', 'GIRAFFE', 'PENGUIN', 'KANGAROO', 'ZEBRA', 'LION', 'MONKEY', 'KOALA'],
      'Countries': ['AUSTRALIA', 'CANADA', 'JAPAN', 'BRAZIL', 'GERMANY', 'FRANCE', 'INDIA', 'MEXICO', 'EGYPT', 'ITALY'],
      'Foods': ['PIZZA', 'HAMBURGER', 'CHOCOLATE', 'SPAGHETTI', 'SUSHI', 'PANCAKE', 'TACO', 'CUPCAKE', 'WAFFLE', 'SANDWICH'],
      'Sports': ['SOCCER', 'BASKETBALL', 'TENNIS', 'SWIMMING', 'VOLLEYBALL', 'BASEBALL', 'HOCKEY', 'GOLF', 'RUGBY', 'CYCLING']
    };
    
    // Select a random category
    const categoryNames = Object.keys(categories);
    const selectedCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const words = categories[selectedCategory];
    
    // Select a random word
    const selectedWord = words[Math.floor(Math.random() * words.length)];
    
    // Game state
    const gameState = {
      word: selectedWord,
      category: selectedCategory,
      guessedLetters: new Set(),
      incorrectGuesses: 0,
      maxIncorrectGuesses: 6,
      gameOver: false,
      won: false
    };
    
    // Function to create the hangman display
    function createHangmanDisplay(incorrectGuesses) {
      const stages = [
        '```\n  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========```',
        '```\n  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========```',
        '```\n  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========```',
        '```\n  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========```',
        '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========```',
        '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========```',
        '```\n  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========```'
      ];
      
      return stages[incorrectGuesses];
    }
    
    // Function to get the current word display
    function getWordDisplay(word, guessedLetters) {
      return word
        .split('')
        .map(letter => (guessedLetters.has(letter) ? letter : '_'))
        .join(' ');
    }
    
    // Function to check if the word is fully guessed
    function isWordGuessed(word, guessedLetters) {
      return word.split('').every(letter => guessedLetters.has(letter));
    }
    
    // Function to update the game message
    async function updateGameMessage() {
      // Check if the game is over
      if (gameState.incorrectGuesses >= gameState.maxIncorrectGuesses) {
        gameState.gameOver = true;
      }
      
      if (isWordGuessed(gameState.word, gameState.guessedLetters)) {
        gameState.gameOver = true;
        gameState.won = true;
      }
      
      // Create the embed
      const embed = new EmbedBuilder()
        .setTitle(`Hangman: ${gameState.category}`)
        .setColor(gameState.gameOver ? (gameState.won ? '#00FF00' : '#FF0000') : '#5865F2')
        .setDescription(createHangmanDisplay(gameState.incorrectGuesses))
        .addFields({ name: 'Word', value: '```' + getWordDisplay(gameState.word, gameState.guessedLetters) + '```' });
      
      // Add guessed letters field if there are any
      if (gameState.guessedLetters.size > 0) {
        embed.addFields({ 
          name: 'Guessed Letters', 
          value: Array.from(gameState.guessedLetters).sort().join(', ') 
        });
      }
      
      // Add game result if game is over
      if (gameState.gameOver) {
        embed.addFields({ 
          name: gameState.won ? 'You Win! 🎉' : 'Game Over ☠️', 
          value: `The word was: **${gameState.word}**` 
        });
      }
      
      // Create letter buttons
      const rows = [];
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
      // Split alphabet into 2 rows of 13 letters each
      for (let rowIndex = 0; rowIndex < 2; rowIndex++) {
        const row = new ActionRowBuilder();
        
        for (let i = 0; i < 13; i++) {
          const letterIndex = rowIndex * 13 + i;
          if (letterIndex < alphabet.length) {
            const letter = alphabet[letterIndex];
            const isGuessed = gameState.guessedLetters.has(letter);
            
            row.addComponents(
              new ButtonBuilder()
                .setCustomId(`hangman_${letter}`)
                .setLabel(letter)
                .setStyle(isGuessed ? ButtonStyle.Secondary : ButtonStyle.Primary)
                .setDisabled(isGuessed || gameState.gameOver)
            );
          }
        }
        
        rows.push(row);
      }
      
      // If the game is over, add a play again button
      if (gameState.gameOver) {
        const actionRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('hangman_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
          );
        
        rows.push(actionRow);
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
                       (i.customId.startsWith('hangman_') || i.customId === 'hangman_play_again');
    
    const collector = message.createMessageComponentCollector({ filter, time: 300000 }); // 5 minutes
    
    // Handle button presses
    collector.on('collect', async i => {
      if (i.customId === 'hangman_play_again') {
        // Start a new game
        collector.stop();
        await this.execute(interaction);
        return;
      }
      
      // Get the guessed letter
      const letter = i.customId.replace('hangman_', '');
      
      // Add to guessed letters
      gameState.guessedLetters.add(letter);
      
      // Check if the letter is in the word
      if (!gameState.word.includes(letter)) {
        gameState.incorrectGuesses++;
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
      if (collected.size === 0 || !gameState.gameOver) {
        // Game timed out
        gameState.gameOver = true;
        
        const timeoutEmbed = new EmbedBuilder()
          .setTitle(`Hangman: ${gameState.category}`)
          .setColor('#FF0000')
          .setDescription(createHangmanDisplay(gameState.incorrectGuesses))
          .addFields(
            { name: 'Word', value: '```' + gameState.word.split('').join(' ') + '```' },
            { name: 'Game Over: Timed Out ⏱️', value: `The word was: **${gameState.word}**` }
          );
        
        // If there were guessed letters, add them
        if (gameState.guessedLetters.size > 0) {
          timeoutEmbed.addFields({ 
            name: 'Guessed Letters', 
            value: Array.from(gameState.guessedLetters).sort().join(', ') 
          });
        }
        
        // Create a play again button
        const actionRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('hangman_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true) // Disabled because the collector has ended
          );
        
        await message.edit({ embeds: [timeoutEmbed], components: [actionRow] });
      }
    });
  }
};