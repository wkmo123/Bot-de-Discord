module.exports = (message, serverQueue) => {
    if (!serverQueue || !serverQueue.playing) {
        return message.reply('No hay ninguna canción que pausar.');
    }
    serverQueue.player.pause();
    serverQueue.playing = false;
    message.reply('Canción pausada.');
};
