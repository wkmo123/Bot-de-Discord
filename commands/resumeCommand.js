module.exports = (message, serverQueue) => {
    if (!serverQueue || serverQueue.playing) {
        return message.reply('No hay ninguna canción que reanudar.');
    }
    serverQueue.player.unpause();
    serverQueue.playing = true;
    message.reply('Canción reanudada.');
};
