const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of all available commands or information about a specific command')
    .addStringOption(option => 
      option.setName('command')
        .setDescription('The specific command to get information about')
        .setRequired(false)),
  
  async execute(interaction, client) {
    const commandOption = interaction.options.getString('command');
    
    if (commandOption) {
      // Show info for a specific command
      const command = client.commands.get(commandOption.toLowerCase());
      
      if (!command) {
        return interaction.reply({ content: `I couldn't find any command called \`${commandOption}\`.`, ephemeral: true });
      }
      
      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(`Command: /${command.data.name}`)
        .setDescription(command.data.description)
        .addFields(
          { name: 'Usage', value: `/help [command:optional]` }
        )
        .setFooter({ text: 'Float Bot • All commands use slash command format' });
      
      return interaction.reply({ embeds: [embed] });
    }
    
    // Show all commands
    const utilityCommands = client.commands.filter(cmd => cmd.category === 'utility').map(cmd => `\`/${cmd.data.name}\``).join(', ');
    const funCommands = client.commands.filter(cmd => cmd.category === 'fun').map(cmd => `\`/${cmd.data.name}\``).join(', ');
    const gameCommands = client.commands.filter(cmd => cmd.category === 'games').map(cmd => `\`/${cmd.data.name}\``).join(', ');
    const moderationCommands = client.commands.filter(cmd => cmd.category === 'moderation').map(cmd => `\`/${cmd.data.name}\``).join(', ');
    const miscCommands = client.commands.filter(cmd => cmd.category === 'misc').map(cmd => `\`/${cmd.data.name}\``).join(', ');
    
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('Float Bot Commands')
      .setDescription('Here\'s a list of all available commands, organized by category:')
      .addFields(
        { name: '🛠️ Utility', value: utilityCommands || 'No commands available' },
        { name: '😄 Fun', value: funCommands || 'No commands available' },
        { name: '🎮 Games', value: gameCommands || 'No commands available' },
        { name: '🛡️ Moderation', value: moderationCommands || 'No commands available' },
        { name: '📌 Miscellaneous', value: miscCommands || 'No commands available' }
      )
      .setFooter({ text: 'Use /help [command] to get info on a specific command' });
    
    return interaction.reply({ embeds: [embed] });
  },
  category: 'utility'
};