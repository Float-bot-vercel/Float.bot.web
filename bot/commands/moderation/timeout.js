const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a user for a specified duration')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('duration')
        .setDescription('The duration of the timeout')
        .setRequired(true)
        .addChoices(
          { name: '60 seconds', value: '60s' },
          { name: '5 minutes', value: '5m' },
          { name: '10 minutes', value: '10m' },
          { name: '1 hour', value: '1h' },
          { name: '1 day', value: '1d' },
          { name: '1 week', value: '1w' },
          { name: 'Remove timeout', value: 'remove' }
        ))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('The reason for the timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction) {
    // Get command options
    const targetUser = interaction.options.getUser('user');
    const durationOption = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    
    // Check if bot has permission to moderate members
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({
        content: 'I don\'t have permission to timeout members!',
        ephemeral: true
      });
    }
    
    try {
      // Get the target member from the guild
      const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
      
      // Check if the target member exists in the guild
      if (!targetMember) {
        return interaction.reply({
          content: 'This user is not in the server!',
          ephemeral: true
        });
      }
      
      // Check if the target can be timed out
      if (!targetMember.moderatable) {
        return interaction.reply({
          content: `I cannot timeout ${targetUser.tag}! Their role may be higher than mine.`,
          ephemeral: true
        });
      }
      
      // Check if the command user's role is higher than the target's role
      if (interaction.member.roles.highest.position <= targetMember.roles.highest.position) {
        return interaction.reply({
          content: `You cannot timeout ${targetUser.tag}! Their role is higher than or equal to yours.`,
          ephemeral: true
        });
      }
      
      // Parse the duration
      let durationMs = null;
      let durationText = '';
      
      if (durationOption === 'remove') {
        durationMs = null;
        durationText = 'Removed';
      } else {
        const value = parseInt(durationOption.slice(0, -1));
        const unit = durationOption.slice(-1);
        
        switch (unit) {
          case 's':
            durationMs = value * 1000;
            durationText = `${value} second(s)`;
            break;
          case 'm':
            durationMs = value * 60 * 1000;
            durationText = `${value} minute(s)`;
            break;
          case 'h':
            durationMs = value * 60 * 60 * 1000;
            durationText = `${value} hour(s)`;
            break;
          case 'd':
            durationMs = value * 24 * 60 * 60 * 1000;
            durationText = `${value} day(s)`;
            break;
          case 'w':
            durationMs = value * 7 * 24 * 60 * 60 * 1000;
            durationText = `${value} week(s)`;
            break;
          default:
            return interaction.reply({
              content: 'Invalid duration format',
              ephemeral: true
            });
        }
      }
      
      // Apply or remove the timeout
      await targetMember.timeout(durationMs, `${reason} (By ${interaction.user.tag})`);
      
      // Create and send the success embed
      const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle(durationOption === 'remove' ? 'Timeout Removed' : 'User Timed Out')
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `${targetUser.tag} (${targetUser.id})` },
          { name: 'Moderator', value: interaction.user.tag },
          { name: 'Duration', value: durationText },
          { name: 'Reason', value: reason }
        )
        .setTimestamp()
        .setFooter({ text: 'Float Bot • Moderation Action' });
      
      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Error in timeout command:', error);
      return interaction.reply({
        content: `An error occurred while trying to timeout the user: ${error.message}`,
        ephemeral: true
      });
    }
  },
  category: 'moderation'
};