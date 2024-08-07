// handleCommand.js

const playCommand = require('./playCommand');
const skipCommand = require('./skipCommand');
const pauseCommand = require('./pauseCommand');
const resumeCommand = require('./resumeCommand');
const queueCommand = require('./queueCommand');
const valorantChampCommand = require('./valorantChampCommand');

module.exports = (command, message, args, queue) => {
    const serverQueue = queue.get(message.guild.id);

    switch (command) {
        case '!play':
            playCommand(message, args, serverQueue, queue);
            break;
        case '!skip':
            skipCommand(message, serverQueue, queue);
            break;
        case '!pause':
            pauseCommand(message, serverQueue);
            break;
        case '!resume':
            resumeCommand(message, serverQueue);
            break;
        case '!queue':
            queueCommand(message, serverQueue);
            break;
        case '!valorantchamp':
            valorantChampCommand(message);
            break;
        default:
            message.reply('Comando no reconocido.');
    }
};
