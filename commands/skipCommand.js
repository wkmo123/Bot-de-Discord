const play = require('../utils/play');

module.exports = (message, serverQueue, queue) => {
    if (!serverQueue) {
        return message.reply('No hay ninguna canción que saltar.');
    }
    if (serverQueue.songs.length > 1) {
        serverQueue.songs.shift();
        play(message.guild, serverQueue.songs[0], queue);
    } else {
        serverQueue.player.stop();
        serverQueue.connection.destroy();
        queue.delete(message.guild.id);
        return message.reply('No hay más canciones en la cola, desconectando.');
    }
};
