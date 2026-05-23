import { SlashCommandBuilder } from 'discord.js';
const { default: embeds } = await import('../cmdModules/embeds.js');

import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const sand = 584493443032547373

export default {
    definition: new SlashCommandBuilder()
      .setName('whitelist')
      .setDescription('[R] Whitelist the use of this bot.')
      .setIntegrationTypes([0, 1]) 
      .setContexts([0, 1, 2])
      
      .addStringOption(option =>
        option.setName('user_id')
        .setRequired(true)
        .setDescription("The discord user ID of whom to provide access.")
      ),
    
    handler: async (interaction) => {
        const authorId = interaction.user.id

        if (authorId !== sand) {
          await interaction.reply({content: "Unauthorized\nContact 'sand_underman3' for a whitelist.", ephemeral: true});
          return;
        }

        const userId = interaction.options.getString('user_id')

        const [titleMsg, description, fields] = [
            'Whitelist added',
            `<@${userId}> has been added to ${interaction.client.user.username}'s whitelist.`,
            []
        ]
        
        const embed = embeds.createEmbed(titleMsg || 'No Title', description || 'N/A', fields)

        const avatar = interaction.client.user.displayAvatarURL();
        embed.setThumbnail(avatar);

        await prisma.user.create({
          data: { id: userId },
          skipDuplicates: true
        });

        await interaction.reply({ 
            embeds: [embed],
        });
    }
}