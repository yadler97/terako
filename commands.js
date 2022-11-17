const { SlashCommandBuilder } = require('discord.js');

const image = new SlashCommandBuilder()
    .setName('image')
    .setNameLocalizations({
        de: 'bild',
    })
    .setDescription('sends an image based on a search term')
    .setDescriptionLocalizations({
        de: 'sendet ein Bild basierend auf einem Suchtext',
    })
    .addStringOption((option) => option
        .setName('searchterm')
        .setNameLocalizations({
            de: 'suchtext',
        })
        .setDescription('search term')
        .setDescriptionLocalizations({
            de: 'Suchtext',
        })
        .setRequired(true));

const wiki = new SlashCommandBuilder()
    .setName('wiki')
    .setNameLocalizations({
        de: 'wiki',
    })
    .setDescription('defines something based on a search term')
    .setDescriptionLocalizations({
        de: 'definiert etwas anhand eines Suchbegriffs',
    })
    .addStringOption((option) => option
        .setName('searchterm')
        .setNameLocalizations({
            de: 'suchtext',
        })
        .setDescription('search term to use (leave empty for random article)')
        .setDescriptionLocalizations({
            de: 'Suchtext (leer lassen für Zufallsartikel)',
        })
        .setRequired(false));

const corona = new SlashCommandBuilder()
    .setName('corona')
    .setNameLocalizations({
        de: 'corona',
    })
    .setDescription('returns current corona numbers for Germany')
    .setDescriptionLocalizations({
        de: 'gibt aktuelle Corona-Zahlen zu Deutschland aus',
    })
    .addStringOption((option) => option
        .setName('region')
        .setNameLocalizations({
            de: 'region',
        })
        .setDescription('region for which corona numbers should be returned')
        .setDescriptionLocalizations({
            de: 'Region für die aktuelle Corona-Zahlen ausgegeben werden sollen',
        })
        // .addChoices(
        //    ...coronaModule.getRegions(),
        // )
        .setRequired(false));

const coronaState = new SlashCommandBuilder()
    .setName('coronastate')
    .setNameLocalizations({
        de: 'coronabundesländer',
    })
    .setDescription('returns current corona numbers for Germany pre state')
    .setDescriptionLocalizations({
        de: 'gibt aktuelle Corona-Zahlen zu Deutschland nach Bundesländern aus',
    });

const play = new SlashCommandBuilder()
    .setName('play')
    .setNameLocalizations({
        de: 'abspielen',
    })
    .setDescription('plays a YouTube video in a voice channel')
    .setDescriptionLocalizations({
        de: 'spielt ein YouTube-Video in einem Audiokanal ab',
    })
    .setDMPermission(false)
    .addStringOption((option) => option
        .setName('video')
        .setNameLocalizations({
            de: 'video',
        })
        .setDescription('url or search term for a video')
        .setDescriptionLocalizations({
            de: 'URL oder Suchtext für ein Video',
        })
        .setRequired(true));

const leave = new SlashCommandBuilder()
    .setName('leave')
    .setNameLocalizations({
        de: 'verlassen',
    })
    .setDescription('kicks the bot out of a voice channel')
    .setDescriptionLocalizations({
        de: 'schmeißt den Bot aus einem Audiokanal raus',
    })
    .setDMPermission(false);

const translate = new SlashCommandBuilder()
    .setName('translate')
    .setNameLocalizations({
        de: 'übersetzen',
    })
    .setDescription('translates a text into a given language')
    .setDescriptionLocalizations({
        de: 'übersetzt einen Text in eine bestimmte Sprache',
    })
    .addStringOption((option) => option
        .setName('target_language')
        .setNameLocalizations({
            de: 'zielsprache',
        })
        .setDescription('language the text should be translated into')
        .setDescriptionLocalizations({
            de: 'Sprache, in die der Text übersetzt werden soll',
        })
        .setRequired(true))
    .addStringOption((option) => option
        .setName('text')
        .setNameLocalizations({
            de: 'text',
        })
        .setDescription('text that should be translated')
        .setDescriptionLocalizations({
            de: 'Text, der übersetzt werden soll',
        })
        .setRequired(true));

const languageList = new SlashCommandBuilder()
    .setName('languagelist')
    .setNameLocalizations({
        de: 'sprachliste',
    })
    .setDescription('returns a list of supported languages for translate command')
    .setDescriptionLocalizations({
        de: 'gibt eine Liste mit unterstützten Sprachen für den Übersetzen-Befehl aus',
    });

const game = new SlashCommandBuilder()
    .setName('game')
    .setNameLocalizations({
        de: 'spiel',
    })
    .setDescription('returns information about a certain video game')
    .setDescriptionLocalizations({
        de: 'gibt Informationen zu einem bestimmten Videospiel zurück',
    })
    .addStringOption((option) => option
        .setName('title')
        .setNameLocalizations({
            de: 'titel',
        })
        .setDescription('title of the game')
        .setDescriptionLocalizations({
            de: 'Titel des Spiels',
        })
        .setRequired(true));

const upcoming = new SlashCommandBuilder()
    .setName('upcoming')
    .setNameLocalizations({
        de: 'bevorstehend',
    })
    .setDescription('returns a list of the most wanted upcoming games')
    .setDescriptionLocalizations({
        de: 'gibt eine Liste der meisterwarteten bevorstehenden Videospiele aus',
    })
    .addStringOption((option) => option
        .setName('platform')
        .setNameLocalizations({
            de: 'plattform',
        })
        .setDescription('platform the games will be released on')
        .setDescriptionLocalizations({
            de: 'Plattform, auf der die Spiele veröffentlicht werden',
        })
        .setRequired(false));

const anime = new SlashCommandBuilder()
    .setName('anime')
    .setNameLocalizations({
        de: 'anime',
    })
    .setDescription('returns information about a certain anime')
    .setDescriptionLocalizations({
        de: 'gibt Informationen zu einem bestimmten Anime zurück',
    })
    .addStringOption((option) => option
        .setName('title')
        .setNameLocalizations({
            de: 'titel',
        })
        .setDescription('title of the anime')
        .setDescriptionLocalizations({
            de: 'Titel des Animes',
        })
        .setRequired(true));

const manga = new SlashCommandBuilder()
    .setName('manga')
    .setNameLocalizations({
        de: 'manga',
    })
    .setDescription('returns information about a certain manga')
    .setDescriptionLocalizations({
        de: 'gibt Informationen zu einem bestimmten Manga zurück',
    })
    .addStringOption((option) => option
        .setName('title')
        .setNameLocalizations({
            de: 'titel',
        })
        .setDescription('title of the manga')
        .setDescriptionLocalizations({
            de: 'Titel des Mangas',
        })
        .setRequired(true));

const animelist = new SlashCommandBuilder()
    .setName('animelist')
    .setNameLocalizations({
        de: 'animeliste',
    })
    .setDescription('returns a list of animes of a certain genre in the current season')
    .setDescriptionLocalizations({
        de: 'gibt Animes eines bestimmten Genres in der aktuellen Season aus',
    })
    .addStringOption((option) => option
        .setName('genre')
        .setNameLocalizations({
            de: 'genre',
        })
        .setDescription('genre of the animes')
        .setDescriptionLocalizations({
            de: 'Genre der Animes',
        })
        .setRequired(true));

const train = new SlashCommandBuilder()
    .setName('train')
    .setNameLocalizations({
        de: 'zug',
    })
    .setDescription('returns a list of train connections from one station to another station')
    .setDescriptionLocalizations({
        de: 'gibt die nächsten Verbindungen von einem Bahnhof zu einem anderen Bahnhof aus',
    })
    .addStringOption((option) => option
        .setName('origin')
        .setNameLocalizations({
            de: 'start',
        })
        .setDescription('station of origin')
        .setDescriptionLocalizations({
            de: 'Startbahnhof',
        })
        .setRequired(true))
    .addStringOption((option) => option
        .setName('destination')
        .setNameLocalizations({
            de: 'ziel',
        })
        .setDescription('station of destination')
        .setDescriptionLocalizations({
            de: 'Zielbahnhof',
        })
        .setRequired(true));

const departure = new SlashCommandBuilder()
    .setName('departure')
    .setNameLocalizations({
        de: 'abfahrt',
    })
    .setDescription('returns a list of next departures from a certain station')
    .setDescriptionLocalizations({
        de: 'gibt die nächsten Abfahrten von einem Bahnhof aus',
    })
    .addStringOption((option) => option
        .setName('station')
        .setNameLocalizations({
            de: 'bahnhof',
        })
        .setDescription('station')
        .setDescriptionLocalizations({
            de: 'Bahnhof',
        })
        .setRequired(true));

const arrival = new SlashCommandBuilder()
    .setName('arrival')
    .setNameLocalizations({
        de: 'ankunft',
    })
    .setDescription('returns a list of next arrivals from a certain station')
    .setDescriptionLocalizations({
        de: 'gibt die nächsten Ankünfte von einem Bahnhof aus',
    })
    .addStringOption((option) => option
        .setName('station')
        .setNameLocalizations({
            de: 'bahnhof',
        })
        .setDescription('station')
        .setDescriptionLocalizations({
            de: 'Bahnhof',
        })
        .setRequired(true));

const converter = new SlashCommandBuilder()
    .setName('convert')
    .setNameLocalizations({
        de: 'umrechnen',
    })
    .setDescription('converts a monetary value into another currency')
    .setDescriptionLocalizations({
        de: 'rechnet einen Geldbetrag in eine andere Währung um',
    })
    .addStringOption((option) => option
        .setName('input')
        .setNameLocalizations({
            de: 'eingabe',
        })
        .setDescription('input currency')
        .setDescriptionLocalizations({
            de: 'Eingabewährung',
        })
        .setRequired(true))
    .addStringOption((option) => option
        .setName('output')
        .setNameLocalizations({
            de: 'ausgabe',
        })
        .setDescription('output currency')
        .setDescriptionLocalizations({
            de: 'Ausgabewährung',
        })
        .setRequired(true))
    .addStringOption((option) => option
        .setName('amount')
        .setNameLocalizations({
            de: 'betrag',
        })
        .setDescription('amount of money')
        .setDescriptionLocalizations({
            de: 'Geldbetrag',
        })
        .setRequired(true));

module.exports = {
    image,
    wiki,
    corona,
    coronaState,
    play,
    leave,
    translate,
    languageList,
    game,
    upcoming,
    anime,
    manga,
    animelist,
    train,
    departure,
    arrival,
    converter,
};
