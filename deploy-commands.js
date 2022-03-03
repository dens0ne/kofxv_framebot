const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env['DISCORD_TOKEN'];
const clientId = process.env['CLIENT_ID'];

// Register application commands.
const commands = []
const applicationCommandFiles = fs.readdirSync('./commands/application').filter(file => file.endsWith('.js'));

for (const file of applicationCommandFiles) {
  const command = require(`./commands/application/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);
rest.put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

// Register guild commands.
const guildCommands = []
const guildCommandFiles = fs.readdirSync('./commands/guild').filter(file => file.endsWith('.js'));
for (const file of guildCommandFiles) {
  const guildCommand = require(`./commands/guild/${file}`);
  guildCommands.push(guildCommand.data.toJSON());
}

const guildId = process.env['GUILD_ID'];
const guildRest = new REST({ version: '9' }).setToken(token);
guildRest.put(Routes.applicationGuildCommands(clientId, guildId), { body: guildCommands })
  .then(() => console.log('Successfully registered guild commands.'))
  .catch(console.error);
