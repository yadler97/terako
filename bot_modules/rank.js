const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);
const { MessageEmbed } = require('discord.js');

client.on("error", function(error) {
    console.warn(error);
    client.quit()
});

const increaseLevel = function(msg) {
    if (msg.channel.type != "dm" && !msg.author.bot) {
        let redis_key = msg.guild.id + "/" + msg.author.id

        client.get(redis_key, function(err, value) {
            if (value == null) {
                client.set(redis_key, 1)
            } else {
                client.incr(redis_key)
                let new_value = parseInt(value) + 1
                if (new_value == 10) {
                    sendLevelUpMsg(msg, 1)
                } else if (new_value == 30) {
                    sendLevelUpMsg(msg, 2)
                } else if (new_value == 60) {
                    sendLevelUpMsg(msg, 3)
                } else if (new_value == 100) {
                    sendLevelUpMsg(msg, 4)
                } else if (new_value == 150) {
                    sendLevelUpMsg(msg, 5)
                } else if (new_value % 100 == 0) {
                    let rank = new_value / 100 + 4
                    sendLevelUpMsg(msg, rank)
                }
            }
        })
    }
}

const sendLevelUpMsg = function(msg, level) {
    msg.channel.send("Herzlichen Glückwunsch, <@!" + msg.author.id + ">, du hast Stufe " + level + " erreicht!")
}

const getLevel = function(msg) {
    getRanking(msg)

    if (msg.channel.type != "dm") {
        let redis_key = msg.guild.id + "/" + msg.author.id

        client.get(redis_key, function(err, value) {
            if (value < 10) {
                sendCurrentRank(msg, 0, (10 - value))
            } else if (value >= 10 && value < 30) {
                sendCurrentRank(msg, 1, (30 - value))
            } else if (value >= 30 && value < 60) {
                sendCurrentRank(msg, 2, (60 - value))
            } else if (value >= 60 && value < 100) {
                sendCurrentRank(msg, 3, (100 - value))
            } else if (value >= 100 && value < 150) {
                sendCurrentRank(msg, 4, (150 - value))
            } else if (value >= 150 && value < 200) {
                sendCurrentRank(msg, 5, (200 - value))
            } else {
                let rank = Math.floor(value / 100) + 4
                let missing = 100 - value % 100
                sendCurrentRank(msg, rank, missing)
            }
        })
    } else {
        msg.channel.send("Dieser Befehl kann nur auf einem Server genutzt werden")
    }
}

const sendCurrentRank = function(msg, level, missing) {
    msg.channel.send("Deine aktuelle Stufe ist " + level + ". Dir fehlen noch " + missing + " Erfahrungspunkte bis zur nächsten Stufe.")
}

const getRanking = function(msg) {
    if (msg.channel.type != "dm") {
        client.keys(msg.guild.id + "/*", function(err, keys) {
            client.mget(keys, function(err2, values) {
                let idx = 0
                let ranking = []
                for (let key of keys) {
                    let user = msg.guild.members.cache.get(key.split("/")[1])
                    ranking.push({'id': key.split("/")[1], 'username': user.user.username, 'score': parseInt(values[idx])});
                    idx++
                }
                ranking.sort(function (a, b) {
                    return b.score - a.score;
                });

                const embed = new MessageEmbed()
                embed.setTitle("Current Ranking")
                    .setColor(0xffd700)
                    .setDescription(":first_place: " + (ranking.length >= 1 ? ranking[0].username + " (XP: " + ranking[0].score + ")" : "-") + "\n\n" + ":second_place: " + (ranking.length >= 2 ? ranking[1].username : "-") + "\n\n" + ":third_place: " + (ranking.length >= 3 ? ranking[2].username : "-"))
                msg.channel.send(embed)
            })
        })
    }
}

module.exports = {
    increaseLevel,
    getLevel
}