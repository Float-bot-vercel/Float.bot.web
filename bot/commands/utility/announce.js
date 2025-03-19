const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to a specific channel')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('The channel to send the announcement to')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true))
    .addStringOption(option => 
      option.setName('title')
        .setDescription('The title of the announcement')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('message')
        .setDescription('The announcement message')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('color')
        .setDescription('The color of the embed (hex code or common color name)')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('image')
        .setDescription('The URL of an image to include in the announcement')
        .setRequired(false))
    .addBooleanOption(option => 
      option.setName('ping')
        .setDescription('Whether to ping @everyone with the announcement')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  async execute(interaction) {
    // Get command options
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const color = interaction.options.getString('color') || '#5865F2';
    const imageUrl = interaction.options.getString('image');
    const pingEveryone = interaction.options.getBoolean('ping') || false;
    
    // Check if bot has permission to send messages in the target channel
    const permissions = channel.permissionsFor(interaction.guild.members.me);
    if (!permissions.has(PermissionFlagsBits.SendMessages)) {
      return interaction.reply({
        content: `I don't have permission to send messages in ${channel}!`,
        ephemeral: true
      });
    }
    
    // Check if bot has permission to ping @everyone if requested
    if (pingEveryone && !permissions.has(PermissionFlagsBits.MentionEveryone)) {
      return interaction.reply({
        content: `I don't have permission to mention @everyone in ${channel}!`,
        ephemeral: true
      });
    }
    
    try {
      // Create the announcement embed
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(message)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: `Announcement by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
      
      if (imageUrl) {
        embed.setImage(imageUrl);
      }
      
      // Send the announcement
      const content = pingEveryone ? '@everyone' : '';
      await channel.send({ content, embeds: [embed] });
      
      // Send confirmation to the user
      const confirmEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Announcement Sent')
        .setDescription(`Your announcement has been sent to ${channel}!`)
        .setTimestamp();
      
      await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
      
    } catch (error) {
      console.error('Error sending announcement:', error);
      
      // If there's an error with the color, it's a common issue
      if (error.message.includes('color')) {
        return interaction.reply({
          content: `Invalid color format. Please use a valid hex code (e.g., #FF0000) or color name.`,
          ephemeral: true
        });
      }
      
      // For other errors
      await interaction.reply({
        content: `An error occurred while sending the announcement: ${error.message}`,
        ephemeral: true
      });
    }
  },
  category: 'utility'
};