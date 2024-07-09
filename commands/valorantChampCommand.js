// valorantChampCommand.js

const { EmbedBuilder } = require('discord.js');

const agents = {
    sentinels: ['Cypher', 'Killjoy', 'Sage'],
    duelists: ['Jett', 'Phoenix', 'Raze'],
    initiators: ['Breach', 'Sova', 'Skye'],
    controllers: ['Brimstone', 'Omen', 'Viper']
};

const icons = {
    sentinels: 'https://i.pinimg.com/474x/ab/9e/20/ab9e201ef23add95bf66aaf9334f7c50.jpg',
    duelists: 'https://i.pinimg.com/474x/ab/9e/20/ab9e201ef23add95bf66aaf9334f7c50.jpg',
    initiators: 'https://i.pinimg.com/474x/ab/9e/20/ab9e201ef23add95bf66aaf9334f7c50.jpg',
    controllers: 'https://i.pinimg.com/474x/ab/9e/20/ab9e201ef23add95bf66aaf9334f7c50.jpg',
};

function getRandomAgent(categoryAgents) {
    const randomIndex = Math.floor(Math.random() * categoryAgents.length);
    return categoryAgents[randomIndex];
}

function sendValorantChamps(message) {
    const categories = ['sentinels', 'duelists', 'initiators', 'controllers'];

    const fields = categories.map(category => {
        const categoryAgents = agents[category];
        if (categoryAgents) {
            const randomAgent = getRandomAgent(categoryAgents);
            return {
                name: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                value: randomAgent,
                inline: true
            };
        }
    }).filter(Boolean);

    const embed = new EmbedBuilder()
        .setTitle('Recomendacion agente Valorant')
        .setThumbnail('https://i.pinimg.com/236x/e5/72/2e/e5722ede9bdd96d1960b6f692db77204.jpg')
        .setColor('#0099ff')
        .setDescription('Recomendacion para trollear en las rankeds:')
        .addFields(fields)
        .setTimestamp()
        .setFooter({
            text: 'Bot del Number',
            iconURL: 'https://i.pinimg.com/236x/b2/06/0c/b2060c09b8fecb5c65f2505e5a82209a.jpg'
        });

    categories.forEach(category => {
        const iconUrl = icons[category];
        if (iconUrl) {
            embed.addFields({
                name: `${category.charAt(0).toUpperCase() + category.slice(1)} Icon`,
                value: '\u200B',
                inline: true
            }).setThumbnail(iconUrl);
        }
    });

    message.channel.send({ embeds: [embed] });
}

module.exports = sendValorantChamps;
