const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete a specified number of messages from a channel')
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
    .addUserOption(option => 
      option.setName('target')
        .setDescription('Only delete messages from this user')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  async execute(interaction) {
    // Get command options
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('target');
    
    // Check if bot has permission to manage messages
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: 'I don\'t have permission to delete messages!',
        ephemeral: true
      });
    }
    
    try {
      // Defer the reply since this might take a moment
      await interaction.deferReply({ ephemeral: true });
      
      // Fetch messages to delete
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      
      // Filter messages based on criteria
      let filteredMessages = messages;
      
      // Filter by user if specified
      if (targetUser) {
        filteredMessages = messages.filter(msg => msg.author.id === targetUser.id);
      }
      
      // Filter by age (Discord only allows bulk deletion of messages less than 14 days old)
      const twoWeeksAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
      filteredMessages = filteredMessages.filter(msg => msg.createdTimestamp > twoWeeksAgo);
      
      // Limit to the requested amount
      const messagesToDelete = [...filteredMessages.values()].slice(0, amount);
      
      // Delete messages
      if (messagesToDelete.length > 0) {
        await interaction.channel.bulkDelete(messagesToDelete, true);
        
        // Send success message
        const embed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle('Messages Cleared')
          .setDescription(`Successfully deleted ${messagesToDelete.length} messages${targetUser ? ` from ${targetUser.tag}` : ''}.`)
          .setTimestamp()
          .setFooter({ text: 'Float Bot • Moderation Action' });
        
        await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.editReply({
          content: `No suitable messages found to delete. Messages must be less than 14 days old${targetUser ? ` and from ${targetUser.tag}` : ''}.`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Error in clear command:', error);
      
      if (interaction.deferred) {
        await interaction.editReply({
          content: `An error occurred while trying to delete messages: ${error.message}`,
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: `An error occurred while trying to delete messages: ${error.message}`,
          ephemeral: true
        });
      }
    }
  },
  category: 'moderation'
};