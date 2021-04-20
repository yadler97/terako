require('dotenv').config();

const anime = require('./bot_modules/anime.js')
const youtube = require('./bot_modules/youtube.js')
const wikipedia = require('./bot_modules/wiki.js')
const corona = require('./bot_modules/corona.js')
const game = require('./bot_modules/game.js')
const rank = require('./bot_modules/rank.js')

const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = ">"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if (msg.content.toUpperCase().startsWith(prefix + 'ANIME ') || msg.content.toUpperCase().startsWith(prefix + 'A ')) {
        anime.getAnimeInfo(msg, "ANIME")
    }

    if (msg.content.toUpperCase().startsWith(prefix + 'MANGA ') || msg.content.toUpperCase().startsWith(prefix + 'M ')) {
        anime.getAnimeInfo(msg, "MANGA")
    }

    if (msg.content.toUpperCase().startsWith(prefix + 'ANIMELIST ') || msg.content.toUpperCase().startsWith(prefix + 'AL ')) {
        anime.getAnimeList(msg)
    }
    
    if (msg.content.toUpperCase().startsWith(prefix + 'PLAY ') || msg.content.toUpperCase().startsWith(prefix + 'P ')) {
        let video = msg.content.substring(msg.toString().indexOf(' ') + 1)
        if (video.startsWith("https://www.youtube.com/watch") || (video.startsWith("https://youtu.be/"))) {
            youtube.playVideo(msg)
        } else {
            youtube.searchVideo(msg)
        }
    }

    if (msg.content.toUpperCase() === prefix + 'LEAVE' || msg.content.toUpperCase() === prefix + 'L') {
        youtube.leaveAudioChannel(msg)
    }

    if (msg.content.toUpperCase() === prefix + 'CORONA' || msg.content.toUpperCase() === prefix + 'C' || msg.content.toUpperCase().startsWith(prefix + 'CORONA ') || msg.content.toUpperCase().startsWith(prefix + 'C ')) {
        if (msg.content.toUpperCase() === prefix + 'CORONA' || msg.content.toUpperCase() === prefix + 'C') {
            corona.getCoronaIncidenceAndDeaths(msg);
            corona.getCoronaIncidenceWorst(msg);
            corona.getCoronaIncidenceBest(msg);
        } else if (msg.content.substring(msg.toString().indexOf(' ') + 1).toUpperCase() == "BL") {
            corona.getCoronaIncidencePerState(msg);
        } else if (msg.content.substring(msg.toString().indexOf(' ') + 1).toUpperCase() == "IMPFUNGEN") {
            corona.getVaccinationStatus(msg);
        } else {
            corona.getCoronaIncidenceOfRegion(msg);
        }
    }

    if (msg.content.toUpperCase() === prefix + 'WIKI' || msg.content.toUpperCase() === prefix + 'W' || msg.content.toUpperCase().startsWith(prefix + 'WIKI ') || msg.content.toUpperCase().startsWith(prefix + 'W ')) {
        if (msg.content.toUpperCase() === prefix + 'WIKI' || msg.content.toUpperCase() === prefix + 'W') {
            wikipedia.getRandomArticle(msg);
        } else {
            wikipedia.getArticle(msg);
        }
    }

    if (msg.content.toUpperCase().startsWith(prefix + 'GAME ') || msg.content.toUpperCase().startsWith(prefix + 'G ')) {
        game.getGameInfo(msg);
    }

    if (msg.content.toUpperCase() === prefix + 'RANK' || msg.content.toUpperCase() === prefix + 'R') {
        rank.getLevel(msg);
    } else {
        rank.increaseLevel(msg);
    }

    if (msg.content.toUpperCase() === prefix + 'HELP' || msg.content.toUpperCase() === prefix + '?') {
        msg.channel.send("Aktuell stehen folgende Befehle zur Verfügung:\n\
" + prefix + "**A**NIME <Suchbegriff> - *Gibt Infos zu einem Anime aus*\n\
" + prefix + "**A**NIME**L**IST <Genre> - *Gibt Animes eines bestimmten Genres in der aktuellen Season aus*\n\
" + prefix + "**C**ORONA (<Landkreis|Stadt>|BL|IMPFUNGEN) - *Listet aktuelle Corona-Hotspots in Deutschland*\n\
" + prefix + "**G**AME <Suchbegriff> - *Gibt Infos zu einem Videospiel aus*\n\
" + prefix + "**L**EAVE - *Wirft den Bot aus einem Audiokanal*\n\
" + prefix + "**M**ANGA <Suchbegriff> - *Gibt Infos zu einem Manga aus*\n\
" + prefix + "**P**LAY <YouTube-Link>|<Suchbegriff> - *Spielt ein YouTube-Video im Audiokanal ab*\n\
" + prefix + "**R**ANK - *Gibt den aktuellen Rang des Users aus*\n\
" + prefix + "**W**IKI (<Begriff>) - *Definiert einen bestimmten Begriff mithilfe von Wikipedia*\
        ")
    }
});

client.login(process.env.DISCORD_TOKEN);