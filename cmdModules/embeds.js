import { EmbedBuilder } from 'discord.js';

/*
fields should be something like
.addFields({name: x, value: y}, ...)
*/

export default {
    createEmbed(title, description, fields) {
        const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .addFields(...fields)
        .setTimestamp()
        .setColor(0xFFFFFF);
        
        return embed
    }
}