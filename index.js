const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('Bot conectado');
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!play')) {
        const args = message.content.split(' ');
        const url = args[1];
        
        if (message.member.voice.channel) {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });
            
            const stream = ytdl(url, { filter: 'audioonly' });
            const resource = createAudioResource(stream);
            const player = createAudioPlayer();

            player.on(AudioPlayerStatus.Idle, () => connection.destroy());

            player.play(resource);
            connection.subscribe(player);
            
            message.reply(`Reproduciendo los temitas uwu: ${url}`);
        } else {
            message.reply('¡Únete a un canal de voz primero!');
        }
    }
});


client.login('MTI0MjMyMzUyNzM0NDg0ODkwNw.GD8lrP.lbyIiJByMR_0vRajEJULdZATDBgydF5SqvlNzI')