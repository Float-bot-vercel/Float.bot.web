const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emote')
    .setDescription('Sends a random emoticon')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The category of emoticon to send')
        .setRequired(false)
        .addChoices(
          { name: 'Happy', value: 'happy' },
          { name: 'Sad', value: 'sad' },
          { name: 'Angry', value: 'angry' },
          { name: 'Confused', value: 'confused' },
          { name: 'Love', value: 'love' },
          { name: 'Shrug', value: 'shrug' },
          { name: 'Surprise', value: 'surprise' },
          { name: 'Random', value: 'random' }
        )),
  
  async execute(interaction) {
    const category = interaction.options.getString('category') || 'random';
    
    const emoticons = {
      happy: ['(• ◡•)', '(⌒‿⌒)', '(◕‿◕)', 'ʘ‿ʘ', '(ᵔᴥᵔ)', '(≧◡≦)', '(￣ω￣)', '(＾▽＾)', '(✿◠‿◠)', '(*^‿^*)'],
      sad: ['(╥﹏╥)', '(っ˘̩╭╮˘̩)っ', '(ಥ﹏ಥ)', '( ͒˃̩̩⌂˂̩̩ ͒)', '(｡•́︿•̀｡)', '(˘̩╭╮˘̩)', '( ╥ω╥ )', '(◞‸◟；)', '(✖╭╮✖)', '(◕︵◕)'],
      angry: ['(ಠ益ಠ)', '(҂⌣̀_⌣́)', '(-.-)凸', 'ᕙ(⇀‸↼‶)ᕗ', '(¬_¬)', 'ಠ╭╮ಠ', '(ノಠ益ಠ)ノ彡┻━┻', '(╯°□°）╯︵ ┻━┻', '(ง •̀_•́)ง', 'ヽ(≧Д≦)ノ'],
      confused: ['(・・ ) ?', '(・_・ヾ', '(⊙_⊙)', '(◎_◎)', '(⊙.☉)', '(¯\\_(ツ)_/¯)', '(?_?)', '(°ロ°)', '(￢_￢)', '(→_←)'],
      love: ['(♥ω♥*)', '(◍•ᴗ•◍)❤', '( ´ ∀ `)ノ～ ♡', '(♡´▽`♡)', '(≧◡≦) ♡', '(´• ω •`) ♡', '(ღ˘⌣˘ღ)', '( ˘ ³˘)♥', '(っ´ω`c)♡', '♡( ◡‿◡ )'],
      shrug: ['¯\\_(ツ)_/¯', '┐(´～｀)┌', '┐(￣ヘ￣)┌', '┐(´д`)┌', '┐(´∀｀)┌', '╮(╯∀╰)╭', '¯\\_༼ᴼل͜ᴼ༽_/¯', '┐(´～`)┌', '¯\\_(⊙_ʖ⊙)_/¯', '┐( ˘_˘)┌'],
      surprise: ['(⊙_⊙)', '(°o°)', '(O_O)', '(ﾟοﾟ)', '(゜o゜)', '(⚆_⚆)', '( ﾟдﾟ)', '(º_º)', '(⚆ᗝ⚆)', '(• ̥̆ •)']
    };
    
    // Function to get random element from array
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    let emoticon;
    
    if (category === 'random') {
      // Get all emotions as a single array
      const allEmoticons = Object.values(emoticons).flat();
      emoticon = getRandomElement(allEmoticons);
    } else {
      emoticon = getRandomElement(emoticons[category]);
    }
    
    await interaction.reply(emoticon);
  },
  category: 'fun'
};