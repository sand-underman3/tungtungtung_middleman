// lol
import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { readdirSync } from 'fs';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
const sand = '584493443032547373'

import { prisma } from './prisma.js';

const commands = await Promise.all(
  readdirSync('./commands')
  .filter(file => file.endsWith('.js'))
  .map(file => import(`./commands/${file}`).then(def => def.default))
)

await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: commands.map(c => c.definition.toJSON())
});

client.on('interactionCreate', async interaction => {
  await interaction.deferReply();

  if (!interaction.isChatInputCommand()) return;
  if (interaction.user.id !== sand) {
    const isWhitelisted = await prisma.user.findUnique({where: {id: interaction.user.id}});
    if (!isWhitelisted) {
      interaction.reply({
        content: 'Unauthorized',
        ephemeral: true
      })
      return;
    }
  }
  
  const command = commands.find(c => c.definition.name === interaction.commandName);
  await command?.handler(interaction);
});

client.login(process.env.BOT_TOKEN);