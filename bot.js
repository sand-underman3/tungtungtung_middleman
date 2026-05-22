// lol
import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { readdirSync } from 'fs';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

const commands = await Promise.all(
  readdirSync('./commands')
  .filter(file => file.endsWith('.js'))
  .map(file => import(`./commands/${file}`).then(def => def.default))
)

await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: commands.map(c => c.definition.toJSON())
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.find(c => c.definition.name === interaction.commandName);
  await command?.handler(interaction);
});

client.login(process.env.BOT_TOKEN);