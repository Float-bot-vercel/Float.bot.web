const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll with up to 5 options')
    .addStringOption(option => 
      option.setName('question')
        .setDescription('The poll question')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('option1')
        .setDescription('Poll option 1')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('option2')
        .setDescription('Poll option 2')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('option3')
        .setDescription('Poll option 3')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('option4')
        .setDescription('Poll option 4')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('option5')
        .setDescription('Poll option 5')
        .setRequired(false))
    .addIntegerOption(option => 
      option.setName('duration')
        .setDescription('Poll duration in minutes (default: 60)')
        .setMinValue(1)
        .setMaxValue(1440)
        .setRequired(false)),
  
  async execute(interaction) {
    // Get poll options
    const question = interaction.options.getString('question');
    const options = [
      interaction.options.getString('option1'),
      interaction.options.getString('option2'),
      interaction.options.getString('option3'),
      interaction.options.getString('option4'),
      interaction.options.getString('option5'),
    ].filter(option => option !== null);
    
    const duration = interaction.options.getInteger('duration') || 60; // Default: 60 minutes
    const endTime = new Date(Date.now() + duration * 60 * 1000);
    
    // Create poll embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`📊 Poll: ${question}`)
      .setDescription(`React with the buttons below to vote!\nPoll ends: <t:${Math.floor(endTime.getTime() / 1000)}:R>`)
      .setFooter({ text: `Created by ${interaction.user.tag} • Poll ID: ${Date.now()}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();
    
    // Add options to the embed
    for (let i = 0; i < options.length; i++) {
      embed.addFields({ name: `Option ${i + 1}`, value: options[i], inline: true });
    }
    
    // Create vote counts object
    const votes = {};
    options.forEach((_, index) => {
      votes[`option${index + 1}`] = {
        count: 0,
        voters: new Set()
      };
    });
    
    // Create buttons for voting
    const row = new ActionRowBuilder();
    
    for (let i = 0; i < options.length; i++) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`poll_option${i + 1}`)
          .setLabel(`Option ${i + 1}`)
          .setStyle(ButtonStyle.Primary)
      );
    }
    
    // Send the poll
    const pollMessage = await interaction.reply({ 
      embeds: [embed], 
      components: [row], 
      fetchReply: true 
    });
    
    // Create button collector
    const collector = pollMessage.createMessageComponentCollector({ 
      time: duration * 60 * 1000 // Convert minutes to milliseconds
    });
    
    collector.on('collect', async i => {
      // Get option number from button ID (e.g., poll_option1 -> option1)
      const optionKey = i.customId.replace('poll_', '');
      const userId = i.user.id;
      
      // Check if user has already voted for this option
      if (votes[optionKey].voters.has(userId)) {
        // User is removing their vote
        votes[optionKey].count--;
        votes[optionKey].voters.delete(userId);
        await i.reply({ content: 'Your vote has been removed!', ephemeral: true });
      } else {
        // Check if user has voted for another option and remove that vote
        for (const key in votes) {
          if (votes[key].voters.has(userId)) {
            votes[key].count--;
            votes[key].voters.delete(userId);
          }
        }
        
        // Add new vote
        votes[optionKey].count++;
        votes[optionKey].voters.add(userId);
        await i.reply({ content: `You voted for: ${options[parseInt(optionKey.replace('option', '')) - 1]}`, ephemeral: true });
      }
      
      // Update embed with current vote counts
      const updatedEmbed = EmbedBuilder.from(pollMessage.embeds[0])
        .setFields([]);
      
      for (let i = 0; i < options.length; i++) {
        const optionKey = `option${i + 1}`;
        const voteCount = votes[optionKey].count;
        updatedEmbed.addFields({ 
          name: `Option ${i + 1} (${voteCount} vote${voteCount === 1 ? '' : 's'})`, 
          value: options[i], 
          inline: true 
        });
      }
      
      // Update the poll message
      await pollMessage.edit({ embeds: [updatedEmbed] });
    });
    
    collector.on('end', async () => {
      // Disable all buttons
      const disabledRow = new ActionRowBuilder();
      for (let i = 0; i < options.length; i++) {
        disabledRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`poll_option${i + 1}`)
            .setLabel(`Option ${i + 1}`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
        );
      }
      
      // Find winning option(s)
      let maxVotes = 0;
      let winners = [];
      
      for (let i = 0; i < options.length; i++) {
        const optionKey = `option${i + 1}`;
        const voteCount = votes[optionKey].count;
        
        if (voteCount > maxVotes) {
          maxVotes = voteCount;
          winners = [i];
        } else if (voteCount === maxVotes) {
          winners.push(i);
        }
      }
      
      // Create results embed
      const resultsEmbed = EmbedBuilder.from(pollMessage.embeds[0])
        .setTitle(`📊 Poll Results: ${question}`)
        .setDescription(`The poll has ended!${maxVotes === 0 ? ' No votes were cast.' : ''}`)
        .setFields([]);
      
      for (let i = 0; i < options.length; i++) {
        const optionKey = `option${i + 1}`;
        const voteCount = votes[optionKey].count;
        const isWinner = winners.includes(i) && maxVotes > 0;
        
        resultsEmbed.addFields({ 
          name: `${isWinner ? '🏆 ' : ''}Option ${i + 1} (${voteCount} vote${voteCount === 1 ? '' : 's'})`, 
          value: options[i], 
          inline: true 
        });
      }
      
      // Update the poll message with results
      await pollMessage.edit({ 
        embeds: [resultsEmbed], 
        components: [disabledRow] 
      });
    });
  },
  category: 'utility'
};