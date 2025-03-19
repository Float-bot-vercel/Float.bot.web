require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Create a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ] 
});

// Create collections for commands and games
client.commands = new Collection();
client.games = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);
    
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Load game modules
const gamesPath = path.join(__dirname, 'games');
const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.js'));

for (const file of gameFiles) {
  const filePath = path.join(gamesPath, file);
  const game = require(filePath);
  
  // Set a new item in the Collection with the key as the game name and the value as the exported module
  if ('name' in game && 'execute' in game) {
    client.games.set(game.name, game);
  } else {
    console.log(`[WARNING] The game at ${filePath} is missing a required "name" or "execute" property.`);
  }
}

// Register the commands with Discord API
const registerCommands = async () => {
  try {
    const commands = [];
    
    client.commands.forEach(command => {
      commands.push(command.data.toJSON());
    });
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
};

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log(`Bot is online! Logged in as ${client.user.tag}`);
  registerCommands();
});

// Listen for interactions (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  
  if (!command) return;
  
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);