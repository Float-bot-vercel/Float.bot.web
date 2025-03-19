const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tells a random joke'),
  
  async execute(interaction) {
    // Array of family-friendly jokes
    const jokes = [
      { setup: 'Why don\'t scientists trust atoms?', punchline: 'Because they make up everything!' },
      { setup: 'Why did the scarecrow win an award?', punchline: 'Because he was outstanding in his field!' },
      { setup: 'What do you call a fake noodle?', punchline: 'An impasta!' },
      { setup: 'Why did the bicycle fall over?', punchline: 'Because it was two tired!' },
      { setup: 'How does a penguin build its house?', punchline: 'Igloos it together!' },
      { setup: 'What do you call a bear with no teeth?', punchline: 'A gummy bear!' },
      { setup: 'What did the ocean say to the beach?', punchline: 'Nothing, it just waved!' },
      { setup: 'Why don\'t eggs tell jokes?', punchline: 'They\'d crack each other up!' },
      { setup: 'What do you call cheese that isn\'t yours?', punchline: 'Nacho cheese!' },
      { setup: 'What kind of tree fits in your hand?', punchline: 'A palm tree!' },
      { setup: 'Why can\'t you give Elsa a balloon?', punchline: 'Because she will let it go!' },
      { setup: 'How do you organize a space party?', punchline: 'You planet!' },
      { setup: 'What did one wall say to the other wall?', punchline: 'I\'ll meet you at the corner!' },
      { setup: 'What do you call a snowman with a six-pack?', punchline: 'An abdominal snowman!' },
      { setup: 'What\'s brown and sticky?', punchline: 'A stick!' },
      { setup: 'Why did the math book look so sad?', punchline: 'Because it had too many problems!' }
    ];
    
    // Select a random joke
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
    // Create and send embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('😄 Random Joke')
      .addFields(
        { name: randomJoke.setup, value: randomJoke.punchline }
      )
      .setFooter({ text: 'Float Bot • Joke Generator' });
    
    await interaction.reply({ embeds: [embed] });
  },
  category: 'fun'
};