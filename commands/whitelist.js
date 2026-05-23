import { SlashCommandBuilder } from 'discord.js';
const { default: embeds } = await import('../cmdModules/embeds.js');

import { prisma } from '../prisma.js';

const sand = '584493443032547373'

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

        await interaction.editReply({
          content: "<a:universeprocess:1507566530160754749> **Rearranging the Universe..**",
        })

        await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: { id: userId }
        });

        await interaction.editReply({ 
            embeds: [embed],
        });
    }
}