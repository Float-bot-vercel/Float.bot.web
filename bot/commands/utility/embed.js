const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create a custom embed message')
    .addStringOption(option => 
      option.setName('title')
        .setDescription('The title of the embed')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('description')
        .setDescription('The description of the embed')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('color')
        .setDescription('The color of the embed (hex code or common color name)')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('footer')
        .setDescription('The footer text of the embed')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('image')
        .setDescription('The URL of an image to include in the embed')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('thumbnail')
        .setDescription('The URL of a thumbnail to include in the embed')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  async execute(interaction) {
    // Get command options
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color') || '#5865F2';
    const footer = interaction.options.getString('footer');
    const imageUrl = interaction.options.getString('image');
    const thumbnailUrl = interaction.options.getString('thumbnail');
    
    // Create the embed
    try {
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
      
      if (footer) {
        embed.setFooter({ text: footer });
      }
      
      if (imageUrl) {
        embed.setImage(imageUrl);
      }
      
      if (thumbnailUrl) {
        embed.setThumbnail(thumbnailUrl);
      }
      
      // Set timestamp
      embed.setTimestamp();
      
      // Send the embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error creating embed:', error);
      
      // If there's an error with the color, it's a common issue
      if (error.message.includes('color')) {
        return interaction.reply({
          content: `Invalid color format. Please use a valid hex code (e.g., #FF0000) or color name.`,
          ephemeral: true
        });
      }
      
      // For other errors
      await interaction.reply({
        content: `An error occurred while creating the embed: ${error.message}`,
        ephemeral: true
      });
    }
  },
  category: 'utility'
};