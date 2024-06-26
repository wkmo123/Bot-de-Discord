require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const queue = new Map();

client.once('ready', () => {
    console.log('Bot conectado');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!play') {
        const searchTerm = args.join(' ');
        const serverQueue = queue.get(message.guild.id);
        
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
                    playing: true
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
                    play(message.guild, queueContruct.songs[0]);
                    connection.subscribe(queueContruct.player);

                    connection.on(VoiceConnectionStatus.Disconnected, () => {
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
    } else if (command === '!skip') {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue) {
            return message.reply('No hay ninguna canción que saltar.');
        }
        if (serverQueue.songs.length > 1) {
            serverQueue.songs.shift();
            play(message.guild, serverQueue.songs[0]);
        } else {
            serverQueue.player.stop();
            serverQueue.connection.destroy();
            queue.delete(message.guild.id);
            return message.reply('No hay más canciones en la cola, desconectando.');
        }
    } else if (command === '!pause') {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue || !serverQueue.playing) {
            return message.reply('No hay ninguna canción que pausar.');
        }
        serverQueue.player.pause();
        serverQueue.playing = false;
        message.reply('Canción pausada.');
    } else if (command === '!resume') {
        const serverQueue = queue.get(message.guild.id);
        if (!serverQueue || serverQueue.playing) {
            return message.reply('No hay ninguna canción que reanudar.');
        }
        serverQueue.player.unpause();
        serverQueue.playing = true;
        message.reply('Canción reanudada.');
    }
});

async function searchYouTube(searchTerm) {
    const result = await ytSearch(searchTerm);
    return result.videos.length > 0 ? result.videos[0] : null;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.connection.destroy();
        queue.delete(guild.id);
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
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    });
    serverQueue.player.on('error', error => console.error(error));
}

client.login(process.env.DISCORD_TOKEN);
