require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const handleCommand = require('./commands/handleCommand');

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

    handleCommand(command, message, args, queue);
});

client.login(process.env.DISCORD_TOKEN);
