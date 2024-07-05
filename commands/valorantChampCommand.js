// valorantChampCommand.js

const { MessageEmbed } = require('discord.js');

const agents = {
    sentinels: ['Cypher', 'Killjoy', 'Sage'],
    duelists: ['Jett', 'Phoenix', 'Raze'],
    initiators: ['Breach', 'Sova', 'Skye'],
    controllers: ['Brimstone', 'Omen', 'Viper']
};

function sendValorantChamps(message) {
    const categories = ['sentinels', 'duelists', 'initiators', 'controllers'];

    const response = categories.map(category => {
        const categoryAgents = agents[category];
        if (categoryAgents) {
            return `**${category.charAt(0).toUpperCase() + category.slice(1)}:** ${categoryAgents.join(', ')}`;
        }
    }).filter(Boolean);

    const embed = new MessageEmbed()
        .setTitle('Valorant Agent Recommendations')
        .setDescription(response.join('\n\n'))
        .setColor('#0099ff');

    message.channel.send({ embeds: [embed] });
}

module.exports = sendValorantChamps;
