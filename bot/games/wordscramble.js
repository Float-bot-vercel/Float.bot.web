const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'wordscramble',
  description: 'Unscramble the given word to win',
  
  async execute(interaction) {
    // Word categories and words
    const categories = {
      'Animals': ['DOLPHIN', 'ELEPHANT', 'GIRAFFE', 'LEOPARD', 'PENGUIN', 'RACCOON', 'SQUIRREL', 'TIGER', 'ZEBRA'],
      'Foods': ['AVOCADO', 'BANANA', 'CHOCOLATE', 'HAMBURGER', 'PANCAKE', 'POPCORN', 'SANDWICH', 'SPAGHETTI', 'STRAWBERRY'],
      'Countries': ['AUSTRALIA', 'BRAZIL', 'CANADA', 'FRANCE', 'GERMANY', 'ITALY', 'JAPAN', 'MEXICO', 'SPAIN'],
      'Technology': ['COMPUTER', 'KEYBOARD', 'INTERNET', 'MONITOR', 'PRINTER', 'SOFTWARE', 'SMARTPHONE', 'TABLET', 'WIRELESS']
    };
    
    // Select a random category
    const categoryNames = Object.keys(categories);
    const selectedCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const words = categories[selectedCategory];
    
    // Select a random word
    const originalWord = words[Math.floor(Math.random() * words.length)];
    
    // Function to scramble the word
    function scrambleWord(word) {
      const wordArray = word.split('');
      
      // Shuffle the array
      for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
      }
      
      // Make sure it's actually scrambled
      const scrambled = wordArray.join('');
      return scrambled === word ? scrambleWord(word) : scrambled;
    }
    
    // Scramble the word
    const scrambledWord = scrambleWord(originalWord);
    
    // Game state
    const gameState = {
      originalWord,
      scrambledWord,
      category: selectedCategory,
      attempts: 0,
      maxAttempts: 3,
      hints: 0,
      gameOver: false,
      won: false
    };
    
    // Function to give a hint
    function getHint() {
      const hintIndex = gameState.hints;
      gameState.hints++;
      
      if (hintIndex === 0) {
        // First hint: reveal first letter
        return `The first letter is **${originalWord[0]}**`;
      } else if (hintIndex === 1) {
        // Second hint: reveal word length and last letter
        return `The word has **${originalWord.length}** letters and ends with **${originalWord[originalWord.length - 1]}**`;
      } else {
        // Third hint: reveal partial word
        let hint = '';
        for (let i = 0; i < originalWord.length; i++) {
          // Show every other letter
          hint += i % 2 === 0 ? originalWord[i] : '_ ';
        }
        return `Partial word: **${hint}**`;
      }
    }
    
    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle(`Word Scramble: ${selectedCategory}`)
      .setColor('#5865F2')
      .setDescription(`Unscramble this word: **${scrambledWord}**\n\nYou have ${gameState.maxAttempts} attempts.`)
      .setFooter({ text: 'Type your answer in the message input or use buttons for hints' });
    
    // Create button row
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('wordscramble_hint')
          .setLabel('Get Hint')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('wordscramble_give_up')
          .setLabel('Give Up')
          .setStyle(ButtonStyle.Danger)
      );
    
    // Send the initial game message
    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });
    
    // Create collectors for both message responses and button interactions
    const messageFilter = m => m.author.id === interaction.user.id;
    const messageCollector = interaction.channel.createMessageCollector({ 
      filter: messageFilter, 
      time: 120000 // 2 minutes
    });
    
    const buttonFilter = i => i.user.id === interaction.user.id && 
                           i.customId.startsWith('wordscramble_');
    const buttonCollector = message.createMessageComponentCollector({ 
      filter: buttonFilter, 
      time: 120000 // 2 minutes
    });
    
    // Handle message responses (guesses)
    messageCollector.on('collect', async m => {
      // Get the guess and convert to uppercase for comparison
      const guess = m.content.toUpperCase();
      gameState.attempts++;
      
      // Check if the guess is correct
      if (guess === originalWord) {
        gameState.gameOver = true;
        gameState.won = true;
        
        // Create success embed
        const winEmbed = new EmbedBuilder()
          .setTitle(`Word Scramble: ${selectedCategory}`)
          .setColor('#00FF00')
          .setDescription(`🎉 **Correct!** You successfully unscrambled the word: **${originalWord}**\n\nYou solved it in ${gameState.attempts} attempt${gameState.attempts > 1 ? 's' : ''}.`)
          .setFooter({ text: `Category: ${selectedCategory}` });
        
        // Create play again button
        const playAgainRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('wordscramble_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
          );
        
        await message.edit({ embeds: [winEmbed], components: [playAgainRow] });
        
        // Stop both collectors
        messageCollector.stop();
        buttonCollector.stop('win');
        
        // Try to delete the user's message to keep the channel clean
        try {
          await m.delete();
        } catch (error) {
          // Ignore errors if we can't delete the message
          console.error('Could not delete message:', error);
        }
        
        return;
      }
      
      // Incorrect guess
      let responseEmbed;
      
      if (gameState.attempts >= gameState.maxAttempts) {
        // Game over - out of attempts
        gameState.gameOver = true;
        
        responseEmbed = new EmbedBuilder()
          .setTitle(`Word Scramble: ${selectedCategory}`)
          .setColor('#FF0000')
          .setDescription(`❌ **Game Over!** You've used all ${gameState.maxAttempts} attempts.\n\nThe word was: **${originalWord}**`)
          .setFooter({ text: `Category: ${selectedCategory}` });
        
        // Create play again button
        const playAgainRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('wordscramble_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
          );
        
        await message.edit({ embeds: [responseEmbed], components: [playAgainRow] });
        
        // Stop both collectors
        messageCollector.stop();
        buttonCollector.stop('lose');
      } else {
        // Still have attempts left
        responseEmbed = new EmbedBuilder()
          .setTitle(`Word Scramble: ${selectedCategory}`)
          .setColor('#FF9900')
          .setDescription(`❌ **Incorrect!** The word is not **${guess}**.\n\nScrambled word: **${scrambledWord}**\n\nYou have ${gameState.maxAttempts - gameState.attempts} attempt${gameState.maxAttempts - gameState.attempts !== 1 ? 's' : ''} left.`);
        
        if (gameState.hints > 0) {
          // Add previous hints
          responseEmbed.addFields({ name: 'Hints', value: getHint() });
        }
        
        await message.edit({ embeds: [responseEmbed], components: [row] });
      }
      
      // Try to delete the user's message to keep the channel clean
      try {
        await m.delete();
      } catch (error) {
        // Ignore errors if we can't delete the message
        console.error('Could not delete message:', error);
      }
    });
    
    // Handle button interactions
    buttonCollector.on('collect', async i => {
      if (i.customId === 'wordscramble_play_again') {
        // Start a new game
        buttonCollector.stop();
        messageCollector.stop();
        await this.execute(interaction);
        return;
      }
      
      if (i.customId === 'wordscramble_hint') {
        // Check if we've already given the maximum number of hints
        if (gameState.hints >= 3) {
          await i.reply({ 
            content: 'You\'ve already used all available hints!', 
            ephemeral: true 
          });
          return;
        }
        
        // Get a hint
        const hint = getHint();
        
        // Update the embed with the hint
        const hintEmbed = EmbedBuilder.from(message.embeds[0])
          .addFields({ name: `Hint ${gameState.hints}`, value: hint });
        
        await i.update({ embeds: [hintEmbed], components: [row] });
      }
      
      if (i.customId === 'wordscramble_give_up') {
        // Player gives up
        gameState.gameOver = true;
        
        // Create give up embed
        const giveUpEmbed = new EmbedBuilder()
          .setTitle(`Word Scramble: ${selectedCategory}`)
          .setColor('#FF0000')
          .setDescription(`You gave up! The word was: **${originalWord}**`)
          .setFooter({ text: `Category: ${selectedCategory}` });
        
        // Create play again button
        const playAgainRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('wordscramble_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
          );
        
        await i.update({ embeds: [giveUpEmbed], components: [playAgainRow] });
        
        // Stop the message collector
        messageCollector.stop();
      }
    });
    
    // Handle collectors ending
    function handleCollectorEnd() {
      if (!gameState.gameOver) {
        // Game timed out
        gameState.gameOver = true;
        
        const timeoutEmbed = new EmbedBuilder()
          .setTitle(`Word Scramble: ${selectedCategory}`)
          .setColor('#FF0000')
          .setDescription(`⏱️ **Time's up!** The game has ended due to inactivity.\n\nThe word was: **${originalWord}**`)
          .setFooter({ text: `Category: ${selectedCategory}` });
        
        // Create a disabled play again button
        const disabledRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('wordscramble_play_again')
              .setLabel('Play Again')
              .setStyle(ButtonStyle.Success)
              .setDisabled(true)
          );
        
        message.edit({ embeds: [timeoutEmbed], components: [disabledRow] });
      }
    }
    
    messageCollector.on('end', reason => {
      if (reason !== 'win' && reason !== 'lose') {
        handleCollectorEnd();
      }
    });
    
    buttonCollector.on('end', reason => {
      if (reason !== 'win' && reason !== 'lose') {
        handleCollectorEnd();
      }
    });
  }
};