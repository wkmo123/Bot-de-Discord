const { EmbedBuilder } = require('discord.js');

module.exports = (message, serverQueue) => {
    if (!serverQueue || !serverQueue.songs.length) {
        return message.reply('No hay canciones en la cola.');
    }

    const queueEmbed = new EmbedBuilder()
        .setTitle('Cola de canciones')
        .setDescription(serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`).join('\n'));

    message.channel.send({ embeds: [queueEmbed] });
};
