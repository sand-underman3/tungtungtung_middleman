// lol
import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  {
    definition: new SlashCommandBuilder()
      .setName('test')
      .setDescription('Dont worry about this one')
      .addStringOption(option => option.setName('a').setDescription('Parameter a').setRequired(true))
      .addStringOption(option => option.setName('b').setDescription('Parameter b').setRequired(true))
      .addStringOption(option => option.setName('c').setDescription('Parameter c').setRequired(false)),
    handler: async (interaction) => {
      const a = interaction.options.getString('a');
      const b = interaction.options.getString('b');
      const c = interaction.options.getString('c');
      await interaction.reply(`a: ${a}, b: ${b}, c: ${c}`);
    }
  }
];

// split them automatically
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: commands.map(c => c.definition.toJSON())
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.find(c => c.definition.name === interaction.commandName);
  await command?.handler(interaction);
});