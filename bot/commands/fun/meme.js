const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme from Reddit')
    .addStringOption(option => 
      option.setName('subreddit')
        .setDescription('The subreddit to get memes from (default: random selection)')
        .setRequired(false)
        .addChoices(
          { name: 'r/memes', value: 'memes' },
          { name: 'r/dankmemes', value: 'dankmemes' },
          { name: 'r/wholesomememes', value: 'wholesomememes' },
          { name: 'r/programmerhumor', value: 'programmerhumor' },
          { name: 'r/meirl', value: 'meirl' }
        )),
  
  async execute(interaction) {
    // Defer the reply as API request might take time
    await interaction.deferReply();
    
    // Get the subreddit from the options
    let subreddit = interaction.options.getString('subreddit');
    
    // If no subreddit is selected, choose a random one
    if (!subreddit) {
      const subreddits = ['memes', 'dankmemes', 'wholesomememes', 'programmerhumor', 'meirl'];
      subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
    }
    
    try {
      // Fetch a meme from the Reddit API
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=100`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from Reddit: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Filter out stickied, NSFW posts, and posts without images
      const posts = data.data.children.filter(post => 
        !post.data.stickied && 
        !post.data.over_18 &&
        post.data.post_hint === 'image'
      );
      
      // Check if we found any valid posts
      if (posts.length === 0) {
        return interaction.editReply(`Couldn't find any appropriate memes in r/${subreddit}. Try a different subreddit.`);
      }
      
      // Get a random post from the filtered posts
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      const post = randomPost.data;
      
      // Create the embed
      const embed = new EmbedBuilder()
        .setColor('#FF5700') // Reddit orange
        .setTitle(post.title)
        .setURL(`https://reddit.com${post.permalink}`)
        .setImage(post.url)
        .addFields(
          { name: 'Subreddit', value: `r/${subreddit}`, inline: true },
          { name: 'Posted by', value: `u/${post.author}`, inline: true },
          { name: 'Stats', value: `⬆️ ${post.ups} upvotes | 💬 ${post.num_comments} comments`, inline: true }
        )
        .setFooter({ text: 'Powered by Reddit' })
        .setTimestamp();
      
      // Create buttons for actions
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('meme_refresh')
            .setLabel('New Meme')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔄'),
          new ButtonBuilder()
            .setLabel('Open in Reddit')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://reddit.com${post.permalink}`)
            .setEmoji('🔗')
        );
      
      // Send the meme
      const message = await interaction.editReply({ embeds: [embed], components: [row] });
      
      // Create a collector to handle button interactions
      const filter = i => i.customId === 'meme_refresh' && i.user.id === interaction.user.id;
      const collector = message.createMessageComponentCollector({ filter, time: 60000 }); // 1 minute
      
      collector.on('collect', async i => {
        // When "New Meme" is clicked, execute the command again
        await i.deferUpdate();
        
        try {
          // Fetch a new meme from the Reddit API
          const newResponse = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=100`);
          
          if (!newResponse.ok) {
            throw new Error(`Failed to fetch from Reddit: ${newResponse.status} ${newResponse.statusText}`);
          }
          
          const newData = await newResponse.json();
          
          // Filter out stickied, NSFW posts, and posts without images
          const newPosts = newData.data.children.filter(post => 
            !post.data.stickied && 
            !post.data.over_18 &&
            post.data.post_hint === 'image'
          );
          
          // Check if we found any valid posts
          if (newPosts.length === 0) {
            return i.editReply(`Couldn't find any appropriate memes in r/${subreddit}. Try a different subreddit.`);
          }
          
          // Get a random post from the filtered posts, different from the current one
          let newRandomPost;
          do {
            newRandomPost = newPosts[Math.floor(Math.random() * newPosts.length)];
          } while (newRandomPost.data.id === post.id && newPosts.length > 1);
          
          const newPost = newRandomPost.data;
          
          // Create the new embed
          const newEmbed = new EmbedBuilder()
            .setColor('#FF5700') // Reddit orange
            .setTitle(newPost.title)
            .setURL(`https://reddit.com${newPost.permalink}`)
            .setImage(newPost.url)
            .addFields(
              { name: 'Subreddit', value: `r/${subreddit}`, inline: true },
              { name: 'Posted by', value: `u/${newPost.author}`, inline: true },
              { name: 'Stats', value: `⬆️ ${newPost.ups} upvotes | 💬 ${newPost.num_comments} comments`, inline: true }
            )
            .setFooter({ text: 'Powered by Reddit' })
            .setTimestamp();
          
          // Update the row with new URL
          const newRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('meme_refresh')
                .setLabel('New Meme')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🔄'),
              new ButtonBuilder()
                .setLabel('Open in Reddit')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://reddit.com${newPost.permalink}`)
                .setEmoji('🔗')
            );
          
          // Update the message
          await i.editReply({ embeds: [newEmbed], components: [newRow] });
          
          // Reset the collector timer
          collector.resetTimer();
        } catch (error) {
          console.error('Error fetching new meme:', error);
          await i.editReply({ content: 'There was an error refreshing the meme. Please try again.', components: [] });
        }
      });
      
      collector.on('end', () => {
        // Remove the refresh button when the collector ends
        const disabledRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('meme_refresh')
              .setLabel('New Meme')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('🔄')
              .setDisabled(true),
            new ButtonBuilder()
              .setLabel('Open in Reddit')
              .setStyle(ButtonStyle.Link)
              .setURL(`https://reddit.com${post.permalink}`)
              .setEmoji('🔗')
          );
        
        message.edit({ components: [disabledRow] }).catch(console.error);
      });
      
    } catch (error) {
      console.error('Error fetching meme:', error);
      
      // Handle specific error cases
      if (error.message.includes('429')) {
        await interaction.editReply('Rate limited by Reddit. Please try again in a few minutes.');
      } else {
        await interaction.editReply(`Failed to fetch a meme. Error: ${error.message}`);
      }
    }
  },
  category: 'fun'
};