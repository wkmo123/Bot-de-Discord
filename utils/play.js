const ytdl = require('ytdl-core');
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');

module.exports = function play(guild, song, queue) {
    const serverQueue = queue.get(guild.id);
    
    // Verificar que serverQueue esté definido
    if (!serverQueue) {
        console.error('La cola del servidor no está definida.');
        return;
    }

  
    const stream = ytdl(song.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);

    serverQueue.player.play(resource);
    
    const embed = new EmbedBuilder()
        .setTitle(`🎶 Ahora reproduciendo: **${song.title}**`)
        .setURL(song.url)
        .setImage(song.thumbnail);

    serverQueue.textChannel.send({ embeds: [embed] });

    serverQueue.player.on(AudioPlayerStatus.Idle, () => {
        if (serverQueue.loop) {
            play(guild, serverQueue.songs[0], queue);
        } else {
        serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        }
    });

    serverQueue.player.on('error', error => console.error(error));
};
