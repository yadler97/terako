const redis = require('redis');
const { EmbedBuilder } = require('discord.js');

const localization = require('../localization');

const client = redis.createClient(process.env.REDIS_URL);

client.on('error', (error) => {
    console.warn(error);
    client.quit();
});

client.on('ready', () => {
    console.log('Redis ready');
});

function increaseLevel(msg) {
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
}

function sendLevelUpMsg(msg, level) {
    const author = `<@!${msg.author.id}>`;
    msg.channel.send(localization.translate('congratulations_you_have_reached_the_next_rank', { author, level }));
}

function getLevel(interaction) {
    if (client.connected) {
        getRanking(interaction);

        const redisKey = `${interaction.guild.id}/${interaction.user.id}`;

        client.get(redisKey, (err, value) => {
            if (value < 10) {
                sendCurrentRank(interaction, 0, (10 - value));
            } else if (value >= 10 && value < 30) {
                sendCurrentRank(interaction, 1, (30 - value));
            } else if (value >= 30 && value < 60) {
                sendCurrentRank(interaction, 2, (60 - value));
            } else if (value >= 60 && value < 100) {
                sendCurrentRank(interaction, 3, (100 - value));
            } else if (value >= 100 && value < 150) {
                sendCurrentRank(interaction, 4, (150 - value));
            } else if (value >= 150 && value < 200) {
                sendCurrentRank(interaction, 5, (200 - value));
            } else {
                const rank = Math.floor(value / 100) + 4;
                const missing = 100 - (value % 100);
                sendCurrentRank(interaction, rank, missing);
            }
        });
    } else {
        interaction.editReply(localization.translate('your_current_rank_can_not_be_accessed_at_the_moment'));
    }
}

function sendCurrentRank(interaction, level, missing) {
    interaction.editReply(localization.translate('your_current_rank_is', { level, missing }));
}

function getRanking(interaction) {
    client.keys(`${interaction.guild.id}/*`, (err, keys) => {
        client.mget(keys, (err2, values) => {
            let idx = 0;
            const ranking = [];
            for (const key of keys) {
                const user = interaction.guild.members.cache.get(key.split('/')[1]);
                ranking.push({ id: key.split('/')[1], username: user.user.username, score: parseInt(values[idx], 10) });
                idx += 1;
            }
            ranking.sort((a, b) => b.score - a.score);

            const embed = new EmbedBuilder();
            embed.setTitle(localization.translate('current_ranking'))
                .setColor(0xffd700)
                .setDescription(`:first_place: ${ranking.length >= 1 ? `${ranking[0].username} (XP: ${ranking[0].score})` : '-'}\n\n:second_place: ${ranking.length >= 2 ? ranking[1].username : '-'}\n\n:third_place: ${ranking.length >= 3 ? ranking[2].username : '-'}`);
            interaction.channel.send({ embeds: [embed] });
        });
    });
}

module.exports = {
    increaseLevel,
    getLevel,
};
