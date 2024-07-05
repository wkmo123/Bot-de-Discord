const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const searchYouTube = require('../utils/searchYouTube');
const play = require('../utils/play');

module.exports = async (message, args, serverQueue, queue) => {
    const searchTerm = args.join(' ');

    if (!searchTerm) {
        return message.reply('¡Debes proporcionar un URL o un término de búsqueda!');
    }

    if (message.member.voice.channel) {
        let songInfo;
        if (ytdl.validateURL(searchTerm)) {
            const info = await ytdl.getInfo(searchTerm);
            songInfo = {
                url: searchTerm,
                title: info.videoDetails.title,
                thumbnail: info.videoDetails.thumbnails[0].url
            };
        } else {
            const video = await searchYouTube(searchTerm);
            if (!video) {
                return message.reply('No se encontraron resultados para tu búsqueda.');
            }
            songInfo = {
                url: video.url,
                title: video.title,
                thumbnail: video.thumbnail
            };
        }

        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: message.member.voice.channel,
                connection: null,
                songs: [],
                player: createAudioPlayer(),
                playing: true,
                loop: false
            };

            queue.set(message.guild.id, queueContruct);
            queueContruct.songs.push(songInfo);

            try {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                queueContruct.connection = connection;
                play(message.guild, queueContruct.songs[0], queue);
                connection.subscribe(queueContruct.player);

                connection.on('error', () => {
                    queue.delete(message.guild.id);
                });
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.reply('Hubo un error al conectarse al canal de voz.');
            }
        } else {
            serverQueue.songs.push(songInfo);
            return message.reply(`¡Añadido a la cola! **${songInfo.title}**`);
        }
    } else {
        return message.reply('¡Únete a un canal de voz primero!');
    }
};
