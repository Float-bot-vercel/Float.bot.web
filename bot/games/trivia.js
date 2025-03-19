const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'trivia',
  description: 'Play a trivia game with random questions',
  
  async execute(interaction) {
    // Define categories and their corresponding questions
    const categories = {
      'General Knowledge': [
        {
          question: 'What is the capital of France?',
          options: ['Berlin', 'London', 'Paris', 'Madrid'],
          answer: 2, // Paris (index 2)
          explanation: 'Paris is the capital and most populous city of France.'
        },
        {
          question: 'Which planet is known as the Red Planet?',
          options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
          answer: 1, // Mars (index 1)
          explanation: 'Mars is often referred to as the "Red Planet" due to its reddish appearance.'
        },
        {
          question: 'What is the largest ocean on Earth?',
          options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
          answer: 3, // Pacific Ocean (index 3)
          explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.'
        }
      ],
      'Science': [
        {
          question: 'What is the chemical symbol for gold?',
          options: ['Go', 'Gd', 'Au', 'Ag'],
          answer: 2, // Au (index 2)
          explanation: 'Au is the chemical symbol for gold, derived from the Latin word "aurum".'
        },
        {
          question: 'What is the hardest natural substance on Earth?',
          options: ['Gold', 'Iron', 'Diamond', 'Titanium'],
          answer: 2, // Diamond (index 2)
          explanation: 'Diamond is the hardest known natural material on Earth.'
        },
        {
          question: 'Which of these is NOT a type of blood cell?',
          options: ['Red blood cell', 'White blood cell', 'Platelet', 'Melanocyte'],
          answer: 3, // Melanocyte (index 3)
          explanation: 'Melanocytes are cells that produce melanin, the pigment that gives skin its color.'
        }
      ],
      'Entertainment': [
        {
          question: 'Who played Iron Man in the Marvel Cinematic Universe?',
          options: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'],
          answer: 1, // Robert Downey Jr. (index 1)
          explanation: 'Robert Downey Jr. portrayed Tony Stark/Iron Man in the Marvel Cinematic Universe.'
        },
        {
          question: 'Which band performed the song "Bohemian Rhapsody"?',
          options: ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'],
          answer: 1, // Queen (index 1)
          explanation: '"Bohemian Rhapsody" is a song by the British rock band Queen.'
        },
        {
          question: 'Who wrote the Harry Potter series?',
          options: ['J.R.R. Tolkien', 'J.K. Rowling', 'George R.R. Martin', 'Suzanne Collins'],
          answer: 1, // J.K. Rowling (index 1)
          explanation: 'J.K. Rowling is the author of the Harry Potter fantasy series.'
        }
      ]
    };
    
    // Select a random category
    const categoryNames = Object.keys(categories);
    const selectedCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const questions = categories[selectedCategory];
    
    // Select a random question from the category
    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    // Create initial embed
    const questionEmbed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`Trivia: ${selectedCategory}`)
      .setDescription(selectedQuestion.question)
      .setFooter({ text: 'You have 15 seconds to answer' });
    
    // Create buttons for options
    const row = new ActionRowBuilder();
    
    // Add option buttons (A, B, C, D)
    const optionLabels = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < selectedQuestion.options.length; i++) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`trivia_option_${i}`)
          .setLabel(`${optionLabels[i]}: ${selectedQuestion.options[i]}`)
          .setStyle(ButtonStyle.Primary)
      );
    }
    
    // Send the question
    const message = await interaction.reply({
      embeds: [questionEmbed],
      components: [row],
      fetchReply: true
    });
    
    // Create collector for button interactions
    const filter = i => i.user.id === interaction.user.id && i.customId.startsWith('trivia_option_');
    const collector = message.createMessageComponentCollector({ filter, time: 15000 });
    
    // Handle answer
    collector.on('collect', async i => {
      // Get selected option index
      const selectedOption = parseInt(i.customId.split('_').pop());
      
      // Create result embed
      const resultEmbed = new EmbedBuilder()
        .setTitle(`Trivia Result: ${selectedCategory}`)
        .setDescription(selectedQuestion.question);
      
      // Check if the answer is correct
      if (selectedOption === selectedQuestion.answer) {
        resultEmbed
          .setColor('#00FF00')
          .addFields(
            { name: 'Your Answer', value: selectedQuestion.options[selectedOption], inline: true },
            { name: 'Result', value: '✅ Correct!', inline: true },
            { name: 'Explanation', value: selectedQuestion.explanation }
          );
      } else {
        resultEmbed
          .setColor('#FF0000')
          .addFields(
            { name: 'Your Answer', value: selectedQuestion.options[selectedOption], inline: true },
            { name: 'Correct Answer', value: selectedQuestion.options[selectedQuestion.answer], inline: true },
            { name: 'Result', value: '❌ Incorrect!', inline: true },
            { name: 'Explanation', value: selectedQuestion.explanation }
          );
      }
      
      // Create disabled buttons
      const disabledRow = new ActionRowBuilder();
      
      for (let i = 0; i < selectedQuestion.options.length; i++) {
        let style = ButtonStyle.Secondary;
        
        if (i === selectedQuestion.answer) {
          // Correct answer
          style = ButtonStyle.Success;
        } else if (i === selectedOption && i !== selectedQuestion.answer) {
          // Incorrect selected answer
          style = ButtonStyle.Danger;
        }
        
        disabledRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`trivia_option_${i}`)
            .setLabel(`${optionLabels[i]}: ${selectedQuestion.options[i]}`)
            .setStyle(style)
            .setDisabled(true)
        );
      }
      
      // Update the message
      await i.update({
        embeds: [resultEmbed],
        components: [disabledRow]
      });
      
      // Stop the collector since we got an answer
      collector.stop();
    });
    
    // Handle timeout
    collector.on('end', async collected => {
      if (collected.size === 0) {
        // No answer was given
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle(`Trivia Result: ${selectedCategory}`)
          .setDescription(selectedQuestion.question)
          .addFields(
            { name: 'Time\'s Up!', value: 'You didn\'t answer in time.' },
            { name: 'Correct Answer', value: selectedQuestion.options[selectedQuestion.answer] },
            { name: 'Explanation', value: selectedQuestion.explanation }
          );
        
        // Create disabled buttons
        const disabledRow = new ActionRowBuilder();
        
        for (let i = 0; i < selectedQuestion.options.length; i++) {
          let style = ButtonStyle.Secondary;
          
          if (i === selectedQuestion.answer) {
            // Highlight correct answer
            style = ButtonStyle.Success;
          }
          
          disabledRow.addComponents(
            new ButtonBuilder()
              .setCustomId(`trivia_option_${i}`)
              .setLabel(`${optionLabels[i]}: ${selectedQuestion.options[i]}`)
              .setStyle(style)
              .setDisabled(true)
          );
        }
        
        // Update the message
        await message.edit({
          embeds: [timeoutEmbed],
          components: [disabledRow]
        });
      }
    });
  }
};