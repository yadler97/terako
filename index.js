require('dotenv').config();
const Discord = require('discord.js');

const anime = require('./bot_modules/anime');
const youtube = require('./bot_modules/youtube');
const wikipedia = require('./bot_modules/wiki');
const corona = require('./bot_modules/corona');
const game = require('./bot_modules/game');
const rank = require('./bot_modules/rank');
const translator = require('./bot_modules/translator');
const imagesearch = require('./bot_modules/imagesearch');
const localization = require('./localization');

const client = new Discord.Client();

const prefix = '>';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if (!msg.author.bot) {
        let [command, ...message] = msg.content.split(' ');
        command = command.toUpperCase();
        message = message.join(' ');

        if (command === `${prefix}ANIME` || command === `${prefix}A`) {
            if (message !== '') {
                anime.getAnimeInfo(msg, message, 'ANIME');
            } else {
                msg.channel.send(localization.translate('this_command_requires_an_argument'));
            }
        }

        if (command === `${prefix}MANGA` || command === `${prefix}M`) {
            if (message !== '') {
                anime.getAnimeInfo(msg, message, 'MANGA');
            } else {
                msg.channel.send(localization.translate('this_command_requires_an_argument'));
            }
        }

        if (command === `${prefix}ANIMELIST` || command === `${prefix}AL`) {
            if (message !== '') {
                anime.getAnimeList(msg, message);
            } else {
                msg.channel.send(localization.translate('this_command_requires_an_argument'));
            }
        }

        if (command === `${prefix}PLAY` || command === `${prefix}P`) {
            if (message !== '') {
                if (message.startsWith('https://www.youtube.com/watch') || (message.startsWith('https://youtu.be/'))) {
                    youtube.playVideo(msg, message);
                } else {
                    youtube.searchVideo(msg, message);
                }
            } else {
                msg.channel.send(localization.translate('this_command_requires_an_argument'));
            }
        }

        if ((command === `${prefix}LEAVE` || command === `${prefix}L`) && message === '') {
            youtube.leaveAudioChannel(msg);
        }

        if (command === `${prefix}CORONA` || command === `${prefix}C`) {
            if (message === '') {
                corona.getCoronaIncidenceAndDeaths(msg);
                corona.getCoronaIncidenceWorst(msg);
                corona.getCoronaIncidenceBest(msg);
            } else if (message === 'BL') {
                corona.getCoronaIncidencePerState(msg);
            } else if (message === 'IMPFUNGEN') {
                corona.getVaccinationStatus(msg);
            } else {
                corona.getCoronaIncidenceOfRegion(msg, message);
            }
        }

        if (command === `${prefix}WIKI` || command === `${prefix}W`) {
            if (message === '') {
                wikipedia.getRandomArticle(msg);
            } else {
                wikipedia.getArticle(msg, message);
            }
        }

        if (command === `${prefix}GAME` || command === `${prefix}G`) {
            if (message !== '') {
                game.getGameInfo(msg, message);
            } else {
                msg.channel.send(localization.translate('this_command_requires_an_argument'));
            }
        }

        if ((command === `${prefix}RANK` || command === `${prefix}R`) && message === '') {
            rank.getLevel(msg);
        } else {
            rank.increaseLevel(msg);
        }

        if (command === `${prefix}TRANSLATE` || command === `${prefix}T`) {
            if (message === 'LIST') {
                translator.getSupportedLanguages(msg);
            } else if (message !== '') {
                let [lang, ...text] = message.split(' ');
                lang = lang.toLowerCase();
                text = text.join(' ');
                translator.translateText(msg, text, lang);
            } else {
                msg.channel.send(localization.translate('this_command_requires_an_argument'));
            }
        }

        if (command === `${prefix}IMAGE` || command === `${prefix}I`) {
            if (message !== '') {
                imagesearch.searchImage(msg, message);
            } else {
                msg.channel.send(localization.translate('this_command_requires_an_argument'));
            }
        }

        if (command === `${prefix}HELP` || command === `${prefix}?`) {
            msg.channel.send(`${localization.translate('the_following_commands_are_available_at_the_moment')}:\n\

${prefix}**A**NIME ${localization.translate('description_anime')}\n\
${prefix}**A**NIME**L**IST ${localization.translate('description_animelist')}\n\
${prefix}**C**ORONA ${localization.translate('description_corona')}\n\
${prefix}**G**AME ${localization.translate('description_game')}\n\
${prefix}**I**MAGE ${localization.translate('description_image')}\n\
${prefix}**L**EAVE ${localization.translate('description_leave')}\n\
${prefix}**M**ANGA ${localization.translate('description_manga')}\n\
${prefix}**P**LAY ${localization.translate('description_play')}\n\
${prefix}**R**ANK ${localization.translate('description_rank')}\n\
${prefix}**T**RANSLATE ${localization.translate('description_translate')}\n\
${prefix}**W**IKI ${localization.translate('description_wiki')}\
            `);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
