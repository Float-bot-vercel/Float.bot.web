const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// In-memory storage for automod settings
// In a production environment, this would be stored in a database
const autoModSettings = new Map(); // Map of guild ID -> settings

// Default settings
const defaultSettings = {
  enabled: false,
  filterProfanity: false,
  profanityList: ['badword1', 'badword2'], // Basic example, would be more extensive in production
  filterSpam: false,
  spamThreshold: 5, // Number of messages within timeframe
  spamTimeframe: 5, // In seconds
  filterInvites: false,
  filterMentions: false,
  maxMentions: 5,
  filterCaps: false,
  capsThreshold: 70, // Percentage of uppercase letters
  spamTracker: new Map(), // Map of user ID -> array of message timestamps
  exemptRoles: [] // Array of role IDs exempt from automod
};

// Initialize or get settings for a guild
function getSettings(guildId) {
  if (!autoModSettings.has(guildId)) {
    autoModSettings.set(guildId, { ...defaultSettings, spamTracker: new Map() });
  }
  return autoModSettings.get(guildId);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure auto-moderation settings')
    .addSubcommand(subcommand =>
      subcommand
        .setName('toggle')
        .setDescription('Enable or disable auto-moderation')
        .addBooleanOption(option => 
          option.setName('enabled')
            .setDescription('Whether auto-moderation is enabled')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('profanity')
        .setDescription('Configure profanity filter')
        .addBooleanOption(option => 
          option.setName('enabled')
            .setDescription('Whether profanity filter is enabled')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('words')
            .setDescription('Comma-separated list of words to filter')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('spam')
        .setDescription('Configure spam filter')
        .addBooleanOption(option => 
          option.setName('enabled')
            .setDescription('Whether spam filter is enabled')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('threshold')
            .setDescription('Number of messages within timeframe to trigger')
            .setMinValue(2)
            .setMaxValue(20)
            .setRequired(false))
        .addIntegerOption(option =>
          option.setName('timeframe')
            .setDescription('Timeframe in seconds')
            .setMinValue(1)
            .setMaxValue(60)
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('invites')
        .setDescription('Configure Discord invite filter')
        .addBooleanOption(option => 
          option.setName('enabled')
            .setDescription('Whether invite filter is enabled')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('mentions')
        .setDescription('Configure mention spam filter')
        .addBooleanOption(option => 
          option.setName('enabled')
            .setDescription('Whether mention filter is enabled')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('max_mentions')
            .setDescription('Maximum number of mentions allowed in a message')
            .setMinValue(1)
            .setMaxValue(50)
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('caps')
        .setDescription('Configure excessive caps filter')
        .addBooleanOption(option => 
          option.setName('enabled')
            .setDescription('Whether excessive caps filter is enabled')
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName('threshold')
            .setDescription('Percentage threshold (0-100) of uppercase letters')
            .setMinValue(50)
            .setMaxValue(100)
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('exempt')
        .setDescription('Add/remove role exemptions from auto-moderation')
        .addRoleOption(option => 
          option.setName('role')
            .setDescription('The role to exempt')
            .setRequired(true))
        .addBooleanOption(option =>
          option.setName('exempt')
            .setDescription('Whether to exempt (true) or unexempt (false) the role')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('settings')
        .setDescription('View current auto-moderation settings'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    // Check if the user has permission
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true
      });
    }
    
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const settings = getSettings(guildId);
    
    if (subcommand === 'toggle') {
      const enabled = interaction.options.getBoolean('enabled');
      settings.enabled = enabled;
      
      const embed = new EmbedBuilder()
        .setColor(enabled ? '#00FF00' : '#FF0000')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Auto-moderation has been ${enabled ? 'enabled' : 'disabled'} for this server.`)
        .setFooter({ text: 'Use /automod settings to view all settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'profanity') {
      const enabled = interaction.options.getBoolean('enabled');
      settings.filterProfanity = enabled;
      
      const words = interaction.options.getString('words');
      if (words) {
        settings.profanityList = words.split(',').map(word => word.trim().toLowerCase());
      }
      
      const embed = new EmbedBuilder()
        .setColor(enabled ? '#00FF00' : '#FF0000')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Profanity filter has been ${enabled ? 'enabled' : 'disabled'}.`)
        .addFields(
          { name: 'Word Count', value: `${settings.profanityList.length} words in filter list` }
        )
        .setFooter({ text: 'Use /automod settings to view all settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'spam') {
      const enabled = interaction.options.getBoolean('enabled');
      settings.filterSpam = enabled;
      
      const threshold = interaction.options.getInteger('threshold');
      if (threshold) {
        settings.spamThreshold = threshold;
      }
      
      const timeframe = interaction.options.getInteger('timeframe');
      if (timeframe) {
        settings.spamTimeframe = timeframe;
      }
      
      const embed = new EmbedBuilder()
        .setColor(enabled ? '#00FF00' : '#FF0000')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Spam filter has been ${enabled ? 'enabled' : 'disabled'}.`)
        .addFields(
          { name: 'Threshold', value: `${settings.spamThreshold} messages`, inline: true },
          { name: 'Timeframe', value: `${settings.spamTimeframe} seconds`, inline: true }
        )
        .setFooter({ text: 'Use /automod settings to view all settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'invites') {
      const enabled = interaction.options.getBoolean('enabled');
      settings.filterInvites = enabled;
      
      const embed = new EmbedBuilder()
        .setColor(enabled ? '#00FF00' : '#FF0000')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Discord invite filter has been ${enabled ? 'enabled' : 'disabled'}.`)
        .setFooter({ text: 'Use /automod settings to view all settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'mentions') {
      const enabled = interaction.options.getBoolean('enabled');
      settings.filterMentions = enabled;
      
      const maxMentions = interaction.options.getInteger('max_mentions');
      if (maxMentions) {
        settings.maxMentions = maxMentions;
      }
      
      const embed = new EmbedBuilder()
        .setColor(enabled ? '#00FF00' : '#FF0000')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Mention spam filter has been ${enabled ? 'enabled' : 'disabled'}.`)
        .addFields(
          { name: 'Max Mentions', value: `${settings.maxMentions} mentions per message` }
        )
        .setFooter({ text: 'Use /automod settings to view all settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'caps') {
      const enabled = interaction.options.getBoolean('enabled');
      settings.filterCaps = enabled;
      
      const threshold = interaction.options.getInteger('threshold');
      if (threshold) {
        settings.capsThreshold = threshold;
      }
      
      const embed = new EmbedBuilder()
        .setColor(enabled ? '#00FF00' : '#FF0000')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Excessive caps filter has been ${enabled ? 'enabled' : 'disabled'}.`)
        .addFields(
          { name: 'Threshold', value: `${settings.capsThreshold}% uppercase` }
        )
        .setFooter({ text: 'Use /automod settings to view all settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'exempt') {
      const role = interaction.options.getRole('role');
      const exempt = interaction.options.getBoolean('exempt');
      
      if (exempt) {
        // Add role to exempt list if not already present
        if (!settings.exemptRoles.includes(role.id)) {
          settings.exemptRoles.push(role.id);
        }
      } else {
        // Remove role from exempt list
        settings.exemptRoles = settings.exemptRoles.filter(id => id !== role.id);
      }
      
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Role ${role.name} is now ${exempt ? 'exempt from' : 'subject to'} auto-moderation.`)
        .addFields(
          { name: 'Exempt Roles', value: settings.exemptRoles.length ? 
                settings.exemptRoles.map(id => `<@&${id}>`).join(', ') : 'None' }
        )
        .setFooter({ text: 'Use /automod settings to view all settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'settings') {
      // Create a comprehensive embed of all settings
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('Auto-Moderation Settings')
        .setDescription(`Auto-moderation is currently ${settings.enabled ? 'enabled' : 'disabled'} for this server.`)
        .addFields(
          { name: 'Profanity Filter', value: `${settings.filterProfanity ? 'Enabled' : 'Disabled'}\nWords: ${settings.profanityList.length}`, inline: true },
          { name: 'Spam Filter', value: `${settings.filterSpam ? 'Enabled' : 'Disabled'}\nThreshold: ${settings.spamThreshold} in ${settings.spamTimeframe}s`, inline: true },
          { name: 'Invite Filter', value: `${settings.filterInvites ? 'Enabled' : 'Disabled'}`, inline: true },
          { name: 'Mention Filter', value: `${settings.filterMentions ? 'Enabled' : 'Disabled'}\nMax: ${settings.maxMentions}`, inline: true },
          { name: 'Caps Filter', value: `${settings.filterCaps ? 'Enabled' : 'Disabled'}\nThreshold: ${settings.capsThreshold}%`, inline: true },
          { name: '\u200B', value: '\u200B', inline: true }, // Empty field for alignment
          { name: 'Exempt Roles', value: settings.exemptRoles.length ? 
                settings.exemptRoles.map(id => `<@&${id}>`).join(', ') : 'None' }
        )
        .setFooter({ text: 'Use the subcommands to modify settings' })
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
  category: 'moderation'
};