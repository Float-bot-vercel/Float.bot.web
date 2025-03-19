const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('Get a fortune cookie with a random message'),
  
  async execute(interaction) {
    // Array of fortune cookie messages
    const fortunes = [
      "A beautiful, smart, and loving person will be coming into your life.",
      "A dubious friend may be an enemy in camouflage.",
      "A faithful friend is a strong defense.",
      "A fresh start will put you on your way.",
      "A friend asks only for your time not your money.",
      "A pleasant surprise is waiting for you.",
      "Adventure can be real happiness.",
      "All the effort you are making will ultimately pay off.",
      "All your hard work will soon pay off.",
      "Allow compassion to guide your decisions.",
      "An acquaintance of the past will affect you in the near future.",
      "Change is happening in your life, so go with the flow!",
      "Courtesy is contagious.",
      "Curiosity kills boredom. Nothing can kill curiosity.",
      "Disbelief destroys the magic.",
      "Distance yourself from the vain.",
      "Don't just think, act!",
      "Don't worry about money. The best things in life are free.",
      "Every flower blooms in its own sweet time.",
      "Failure is the chance to do better next time.",
      "Follow the middle path. Neither extreme will make you happy.",
      "For hate is never conquered by hate. Hate is conquered by love.",
      "Get your mind set…confidence will lead you on.",
      "Go take a rest; you deserve it.",
      "Good luck is the result of good planning.",
      "Good things are being said about you.",
      "Happiness begins with facing life with a smile and a wink.",
      "Happiness will bring you good luck.",
      "Happy life is just in front of you.",
      "Hard work pays off in the future, laziness pays off now.",
      "Help! I'm being held prisoner in a fortune cookie factory.",
      "If you continually give, you will continually have.",
      "If you look in the right places, you can find some good offerings.",
      "In order to take, one must first give.",
      "It's better to be alone sometimes.",
      "It's time to get moving. Your spirits will lift accordingly.",
      "Keep your face to the sunshine and you will never see shadows.",
      "Listen to everyone. Ideas come from everywhere.",
      "Love is a warm fire to keep the soul warm.",
      "Meeting adversity well is the source of your strength.",
      "Nature, time and patience are the three great physicians.",
      "Never give up. You're not a failure if you don't give up.",
      "Now is a good time to buy stock.",
      "Nothing astonishes men so much as common sense and plain dealing.",
      "Physical activity will dramatically improve your outlook today.",
      "Practice makes perfect.",
      "Rest has a peaceful effect on your physical and emotional health.",
      "Savor your freedom – it is precious.",
      "Seek out the significance of your problem at this time. Try to understand.",
      "Success is a journey, not a destination.",
      "The cure for grief is motion.",
      "The greatest achievement in life is to stand up again after falling.",
      "The wise man is the one that makes you think that he is dumb.",
      "There is no greater pleasure than seeing your loved ones prosper.",
      "There's no such thing as an ordinary cat.",
      "To be old and wise, you must first be young and stupid.",
      "Today it's up to you to create the peacefulness you long for.",
      "When more become too much. It's same as being not enough.",
      "When you look down, all you see is dirt, so keep looking up.",
      "Worry not of the past, treasure today and live for tomorrow.",
      "You are a person of culture and taste. Surround yourself with beauty.",
      "You are interested in higher education, whether material or spiritual.",
      "You are talented in many ways.",
      "You are very expressive and positive in words, act and feeling.",
      "You believe in the goodness of mankind.",
      "You can make your own happiness.",
      "You create your own stage... the audience is waiting.",
      "You have an ambitious nature and may make a name for yourself.",
      "You have the power to write your own fortune.",
      "You know where you are going and how to get there.",
      "You will be called upon to help a friend in trouble.",
      "You will conquer obstacles to achieve success.",
      "You will soon be surrounded by good friends and laughter."
    ];
    
    // Select a random fortune
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    
    // Generate a random lucky numbers
    let luckyNumbers = [];
    for (let i = 0; i < 6; i++) {
      // Generate numbers between 1 and 99
      luckyNumbers.push(Math.floor(Math.random() * 99) + 1);
    }
    
    // Create the fortune cookie embed
    const embed = new EmbedBuilder()
      .setColor('#FFB347') // Fortune cookie color
      .setTitle('🥠 Fortune Cookie')
      .setDescription(`*You crack open the fortune cookie and read the small paper inside...*`)
      .addFields(
        { name: 'Your Fortune', value: `"${fortune}"` },
        { name: 'Lucky Numbers', value: luckyNumbers.join(' - ') }
      )
      .setFooter({ text: 'May good fortune be with you!' })
      .setTimestamp();
    
    // Send the fortune cookie
    await interaction.reply({ embeds: [embed] });
  },
  category: 'fun'
};