const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Displays bot information and stats'),
  
  async execute(interaction, client) {
    // Calculate bot uptime
    const uptime = formatUptime(client.uptime);
    
    // Calculate system resource usage
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMemory = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const cpuUsage = os.loadavg()[0].toFixed(2);
    
    // Count total servers, users, and channels
    const serverCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const channelCount = client.channels.cache.size;
    
    // Count total commands by category
    const commandCategories = {
      utility: client.commands.filter(cmd => cmd.category === 'utility').size,
      fun: client.commands.filter(cmd => cmd.category === 'fun').size,
      games: client.commands.filter(cmd => cmd.category === 'games').size,
      moderation: client.commands.filter(cmd => cmd.category === 'moderation').size,
      misc: client.commands.filter(cmd => cmd.category === 'misc').size
    };
    
    // Create the embed
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('Float Bot Status Panel')
      .setDescription('View detailed information about the bot\'s status and performance.')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 4096 }))
      .addFields(
        { name: '⏱️ Uptime', value: uptime, inline: true },
        { name: '🖥️ Servers', value: serverCount.toString(), inline: true },
        { name: '👥 Users', value: userCount.toString(), inline: true },
        { name: '💾 Memory Usage', value: `${memoryUsage} MB`, inline: true },
        { name: '💻 System Memory', value: `${freeMemory} GB / ${totalMemory} GB`, inline: true },
        { name: '📊 CPU Load', value: `${cpuUsage}%`, inline: true },
        { name: '📝 Commands', value: `
          🛠️ Utility: ${commandCategories.utility}
          😄 Fun: ${commandCategories.fun}
          🎮 Games: ${commandCategories.games}
          🛡️ Moderation: ${commandCategories.moderation}
          📌 Misc: ${commandCategories.misc}
        ` }
      )
      .setFooter({ text: `Float Bot • Version 1.0.0 • Node.js ${process.version}` })
      .setTimestamp();
    
    // Create buttons for additional information
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Invite Bot')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands'),
        new ButtonBuilder()
          .setLabel('Support Server')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/your-support-server'),
        new ButtonBuilder()
          .setLabel('Website')
          .setStyle(ButtonStyle.Link)
          .setURL('https://your-website-url.com')
      );
    
    await interaction.reply({ embeds: [embed], components: [row] });
  },
  category: 'misc'
};

// Helper function to format uptime
function formatUptime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  
  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  
  return parts.join(', ');
}