require('dotenv').config();

const anime = require('./bot_modules/anime.js')
const youtube = require('./bot_modules/youtube.js')

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

    if (msg.content.toUpperCase() === prefix + 'HELP' || msg.content.toUpperCase() === prefix + '?') {
        msg.channel.send("Aktuell stehen folgende Befehle zur Verfügung:\n\
>**A**NIME <Suchbegriff> - *Gibt Infos zu einem Anime aus*\n\
>**A**NIME**L**IST <Genre> - *Gibt Animes eines bestimmten Genres in der aktuellen Season aus*\n\
>**L**EAVE - *Wirft den Bot aus einem Audiokanal*\n\
>**M**ANGA <Suchbegriff> - *Gibt Infos zu einem Manga aus*\n\
>**P**LAY <YouTube-Link>|<Suchbegriff> - *Spielt ein YouTube-Video im Audiokanal ab*\
        ")
    }
});

client.login(process.env.DISCORD_TOKEN);