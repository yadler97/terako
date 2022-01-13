require('dotenv').config();
const Discord = require('discord.js');

const anime = require('./bot_modules/anime');
const youtube = require('./bot_modules/youtube');
const wikipedia = require('./bot_modules/wiki');
const corona = require('./bot_modules/corona');
const game = require('./bot_modules/game');
const rank = require('./bot_modules/rank');
const localization = require('./localization');

const client = new Discord.Client();

const prefix = '>';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if (msg.content.toUpperCase().startsWith(`${prefix}ANIME `) || msg.content.toUpperCase().startsWith(`${prefix}A `)) {
        anime.getAnimeInfo(msg, 'ANIME');
    }

    if (msg.content.toUpperCase().startsWith(`${prefix}MANGA `) || msg.content.toUpperCase().startsWith(`${prefix}M `)) {
        anime.getAnimeInfo(msg, 'MANGA');
    }

    if (msg.content.toUpperCase().startsWith(`${prefix}ANIMELIST `) || msg.content.toUpperCase().startsWith(`${prefix}AL `)) {
        anime.getAnimeList(msg);
    }

    if (msg.content.toUpperCase().startsWith(`${prefix}PLAY `) || msg.content.toUpperCase().startsWith(`${prefix}P `)) {
        const video = msg.content.substring(msg.toString().indexOf(' ') + 1);
        if (video.startsWith('https://www.youtube.com/watch') || (video.startsWith('https://youtu.be/'))) {
            youtube.playVideo(msg, video);
        } else {
            youtube.searchVideo(msg);
        }
    }

    if (msg.content.toUpperCase() === `${prefix}LEAVE` || msg.content.toUpperCase() === `${prefix}L`) {
        youtube.leaveAudioChannel(msg);
    }

    if (msg.content.toUpperCase() === `${prefix}CORONA` || msg.content.toUpperCase() === `${prefix}C` || msg.content.toUpperCase().startsWith(`${prefix}CORONA `) || msg.content.toUpperCase().startsWith(`${prefix}C `)) {
        if (msg.content.toUpperCase() === `${prefix}CORONA` || msg.content.toUpperCase() === `${prefix}C`) {
            corona.getCoronaIncidenceAndDeaths(msg);
            corona.getCoronaIncidenceWorst(msg);
            corona.getCoronaIncidenceBest(msg);
        } else if (msg.content.substring(msg.toString().indexOf(' ') + 1).toUpperCase() === 'BL') {
            corona.getCoronaIncidencePerState(msg);
        } else if (msg.content.substring(msg.toString().indexOf(' ') + 1).toUpperCase() === 'IMPFUNGEN') {
            corona.getVaccinationStatus(msg);
        } else {
            corona.getCoronaIncidenceOfRegion(msg);
        }
    }

    if (msg.content.toUpperCase() === `${prefix}WIKI` || msg.content.toUpperCase() === `${prefix}W` || msg.content.toUpperCase().startsWith(`${prefix}WIKI `) || msg.content.toUpperCase().startsWith(`${prefix}W `)) {
        if (msg.content.toUpperCase() === `${prefix}WIKI` || msg.content.toUpperCase() === `${prefix}W`) {
            wikipedia.getRandomArticle(msg);
        } else {
            wikipedia.getArticle(msg);
        }
    }

    if (msg.content.toUpperCase().startsWith(`${prefix}GAME `) || msg.content.toUpperCase().startsWith(`${prefix}G `)) {
        game.getGameInfo(msg);
    }

    if (msg.content.toUpperCase() === `${prefix}RANK` || msg.content.toUpperCase() === `${prefix}R`) {
        rank.getLevel(msg);
    } else {
        rank.increaseLevel(msg);
    }

    if (msg.content.toUpperCase() === `${prefix}HELP` || msg.content.toUpperCase() === `${prefix}?`) {
        msg.channel.send(`${localization.translate('the_following_commands_are_available_at_the_moment')}:\n\
${prefix}**A**NIME ${localization.translate('description_anime')}\n\
${prefix}**A**NIME**L**IST ${localization.translate('description_animelist')}\n\
${prefix}**C**ORONA ${localization.translate('description_corona')}\n\
${prefix}**G**AME ${localization.translate('description_game')}\n\
${prefix}**L**EAVE ${localization.translate('description_leave')}\n\
${prefix}**M**ANGA ${localization.translate('description_manga')}\n\
${prefix}**P**LAY ${localization.translate('description_play')}\n\
${prefix}**R**ANK ${localization.translate('description_rank')}\n\
${prefix}**W**IKI ${localization.translate('description_wiki')}\
        `);
    }
});

client.login(process.env.DISCORD_TOKEN);
