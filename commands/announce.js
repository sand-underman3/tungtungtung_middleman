import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
const { default: embeds } = await import('../cmdModules/embeds.js');

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

        const [title, description, fields] = [
            'Announcement Command Sent',
            `Your announcement has been sent to jobId (${interaction.options.getString('job_id')})`,
            [
                {name: 'Job Id', value: `${interaction.options.getString('job_id')}`},
                {name: 'Administrator', value: `User: ${interaction.user.username} (${interaction.user.displayName})`}
            ]
        ]

        const embed = embeds.createEmbed(title, description, fields)

        const avatar = interaction.user.displayAvatarURL();
        embed.setThumbnail(avatar);

        await interaction.reply({ 
            embeds: [embed],
            ephemeral: true 
        });
    }
}