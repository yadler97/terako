const redis = require("redis");
const { MessageEmbed } = require('discord.js');

const client = redis.createClient(process.env.REDIS_URL);

client.on('error', (error) => {
    console.warn(error);
    client.quit();
});

const increaseLevel = function (msg) {
    if (msg.channel.type !== 'dm' && !msg.author.bot && client.connected) {
        const redisKey = `${msg.guild.id}/${msg.author.id}`;

        client.get(redisKey, (err, value) => {
            if (value == null) {
                client.set(redisKey, 1);
            } else {
                client.incr(redisKey);
                const newValue = parseInt(value, 10) + 1;
                if (newValue === 10) {
                    sendLevelUpMsg(msg, 1);
                } else if (newValue === 30) {
                    sendLevelUpMsg(msg, 2);
                } else if (newValue === 60) {
                    sendLevelUpMsg(msg, 3);
                } else if (newValue === 100) {
                    sendLevelUpMsg(msg, 4);
                } else if (newValue === 150) {
                    sendLevelUpMsg(msg, 5);
                } else if (newValue % 100 === 0) {
                    const rank = newValue / 100 + 4;
                    sendLevelUpMsg(msg, rank);
                }
            }
        });
    }
};

const sendLevelUpMsg = function (msg, level) {
    msg.channel.send(`Herzlichen Glückwunsch, <@!${msg.author.id}>, du hast Stufe ${level} erreicht!`);
};

const getLevel = function (msg) {
    if (client.connected) {
        getRanking(msg);

        if (msg.channel.type !== 'dm') {
            const redisKey = `${msg.guild.id}/${msg.author.id}`;

            client.get(redisKey, (err, value) => {
                if (value < 10) {
                    sendCurrentRank(msg, 0, (10 - value));
                } else if (value >= 10 && value < 30) {
                    sendCurrentRank(msg, 1, (30 - value));
                } else if (value >= 30 && value < 60) {
                    sendCurrentRank(msg, 2, (60 - value));
                } else if (value >= 60 && value < 100) {
                    sendCurrentRank(msg, 3, (100 - value));
                } else if (value >= 100 && value < 150) {
                    sendCurrentRank(msg, 4, (150 - value));
                } else if (value >= 150 && value < 200) {
                    sendCurrentRank(msg, 5, (200 - value));
                } else {
                    const rank = Math.floor(value / 100) + 4;
                    const missing = 100 - value % 100;
                    sendCurrentRank(msg, rank, missing);
                }
            });
        } else {
            msg.channel.send('Dieser Befehl kann nur auf einem Server genutzt werden');
        }
    } else {
        msg.channel.send('Deine aktuelle Stufe kann momentan nicht abgerufen werden');
    }
};

const sendCurrentRank = function (msg, level, missing) {
    msg.channel.send(`Deine aktuelle Stufe ist ${level}. Dir fehlen noch ${missing} Erfahrungspunkte bis zur nächsten Stufe.`);
};

const getRanking = function (msg) {
    if (msg.channel.type !== 'dm') {
        client.keys(`${msg.guild.id}/*`, (err, keys) => {
            client.mget(keys, (err2, values) => {
                let idx = 0;
                const ranking = [];
                for (const key of keys) {
                    const user = msg.guild.members.cache.get(key.split('/')[1]);
                    ranking.push({ id: key.split('/')[1], username: user.user.username, score: parseInt(values[idx], 10) });
                    idx += 1;
                }
                ranking.sort((a, b) => b.score - a.score);

                const embed = new MessageEmbed();
                embed.setTitle('Current Ranking')
                    .setColor(0xffd700)
                    .setDescription(`:first_place: ${ranking.length >= 1 ? `${ranking[0].username} (XP: ${ranking[0].score})` : '-'}\n\n:second_place: ${ranking.length >= 2 ? ranking[1].username : '-'}\n\n:third_place: ${ranking.length >= 3 ? ranking[2].username : '-'}`);
                msg.channel.send(embed);
            });
        });
    }
};

module.exports = {
    increaseLevel,
    getLevel,
};
