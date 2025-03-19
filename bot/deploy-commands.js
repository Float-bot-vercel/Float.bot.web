require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
      console.log(`Added command: ${command.data.name} (${folder})`);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    // Check if we have CLIENT_ID
    if (!process.env.CLIENT_ID) {
      console.error('Missing CLIENT_ID in .env file!');
      process.exit(1);
    }
    
    // Check if we have the token
    if (!process.env.DISCORD_TOKEN) {
      console.error('Missing DISCORD_TOKEN in .env file!');
      process.exit(1);
    }
    
    // The put method is used to fully refresh all commands globally
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    
    // Optional: Log all registered commands
    console.log('\nRegistered Commands:');
    const categoryMap = {};
    
    // Group commands by category
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if (command.category) {
          if (!categoryMap[command.category]) {
            categoryMap[command.category] = [];
          }
          categoryMap[command.category].push(command.data.name);
        } else {
          if (!categoryMap[folder]) {
            categoryMap[folder] = [];
          }
          categoryMap[folder].push(command.data.name);
        }
      }
    }
    
    // Display commands by category
    for (const category in categoryMap) {
      console.log(`\n${category.charAt(0).toUpperCase() + category.slice(1)} Commands:`);
      categoryMap[category].sort().forEach(cmd => {
        console.log(`  - /${cmd}`);
      });
    }
    
  } catch (error) {
    console.error(error);
  }
})();