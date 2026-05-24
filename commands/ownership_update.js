import { SlashCommandBuilder } from 'discord.js';
import generics from '../cmdModules/generics.js';
const { testNumeric } = generics;

const { default: embeds } = await import('../cmdModules/embeds.js');

import { prisma } from '../prisma.js';

const sand = '584493443032547373'

export default {
    definition: new SlashCommandBuilder()
      .setName('game add')
      .setDescription('[R] Whitelist the use of this bot on a certain game.')
      .setIntegrationTypes([0, 1]) 
      .setContexts([0, 1, 2])
      
      .addStringOption(option =>
        option.setName('user_id')
        .setRequired(true)
        .setDescription("The discord user ID of whom to provide access.")
      )
      .addStringOption(option=>
        option.setName('game_id')
        .setRequired(true)
        .setDescription('The game ID.')
      ),

    handler: async (interaction) => {
        const authorId = interaction.user.id

        if (authorId !== sand) {
          await interaction.editReply({content: "Unauthorized\nContact 'sand_underman3' for a whitelist."});
          return;
        }

        const userId = interaction.options.getString('user_id')
        const gameId = interaction.options.getString('game_id')

        if (!testNumeric(gameId)) {
          await interaction.editReply({content: "The game ID is not a number."});
          return;
        }
        
        const placeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${gameId}/universe`);
        const placeData = await placeResponse.json();
        const universeId = placeData.universeId;

        const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
        const data = await response.json();
        const gameName = data.data[0].name;

        const [titleMsg, description, fields] = [
            'Whitelist added',
            `<@${userId}> has been added to "${gameName}"'s whitelist.`,
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