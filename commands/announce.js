import { SlashCommandBuilder } from 'discord.js';
const { default: embeds } = await import('../cmdModules/embeds.js');

import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default {
    definition: new SlashCommandBuilder()
      .setName('announce')
      .setDescription('Send out a message to a server(s).')
      .setIntegrationTypes([0, 1]) 
      .setContexts([0, 1, 2])

      .addStringOption(option =>
        option.setName('message')
        .setRequired(true)
        .setDescription("The message to be displayed")
      )
      .addStringOption(option => 
        option.setName('title')
        .setRequired(false)
        .setDescription('The title to be displayed as the messenger. Defaults to \'Server\'.')
      )
      .addStringOption(option =>
        option.setName("job_id")
        .setRequired(false)
        .setDescription('If you want to send a message to a specific server, specify its ID.')
      ),

    handler: async (interaction) => {
        const jobId = interaction.options.getString('job_id')
        const message = interaction.options.getString('message') || 'Empty Message'
        const parameters = JSON.stringify(
          { 
            message: message
          }
        )

        const [titleMsg, description, fields] = [
            'Announcement Command Sent',
            `Your announcement has been sent.`,
            [
                {name: 'Job Id', value: `${jobId}`, inline: true},
                {name: 'Administrator', value: `User: ${interaction.user.displayName}`, inline: true},
                {name: 'Message', value: `${message}`}
            ]
        ]
        
        const embed = embeds.createEmbed(titleMsg || 'No Title', description || 'N/A', fields)

        const avatar = interaction.user.displayAvatarURL();
        embed.setThumbnail(avatar);
        
        await interaction.reply({
          content: "<a:universeprocess:1507566530160754749> **Rearranging the Universe..**",
        })

        await prisma.command.create({
          data: {
            jobId: jobId,
            title: interaction.options.getString('title') || 'Server',
            parameters: parameters
          }
        });

        await interaction.editReply({ 
            embeds: [embed],
        });
        
    }
}