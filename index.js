require('dotenv').config();

const { REST, Routes } = require('discord.js');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const anime = require('./bot_modules/anime');
const corona = require('./bot_modules/corona');
const currency = require('./bot_modules/currency');
const game = require('./bot_modules/game');
const imagesearch = require('./bot_modules/imagesearch');
const rank = require('./bot_modules/rank');
const train = require('./bot_modules/train');
const translator = require('./bot_modules/translator');
const wikipedia = require('./bot_modules/wiki');
const youtube = require('./bot_modules/youtube');

const commands = require('./commands');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            {
                body: [
                    commands.image,
                    commands.wiki,
                    commands.corona,
                    commands.coronaState,
                    commands.play,
                    commands.leave,
                    commands.translate,
                    commands.languageList,
                    commands.game,
                    commands.upcoming,
                    commands.anime,
                    commands.manga,
                    commands.animelist,
                    commands.train,
                    commands.departure,
                    commands.arrival,
                    commands.converter,
                    commands.rank,
                ],
            },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === commands.image.name) {
        await interaction.deferReply();
        const result = imagesearch.searchImage(interaction.options.get('searchterm').value);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.wiki.name) {
        const searchTerm = interaction.options.get('searchterm')?.value;

        await interaction.deferReply();
        if (searchTerm === undefined) {
            const result = wikipedia.getRandomArticle();
            await interaction.editReply(result);
        } else {
            const result = wikipedia.getArticle(searchTerm);
            await interaction.editReply(result);
        }
    }

    if (interaction.commandName === commands.corona.name) {
        const region = interaction.options.get('region')?.value;

        await interaction.deferReply();
        if (region === undefined) {
            const overview = corona.getCoronaIncidenceAndDeaths();
            const worst = corona.getCoronaIncidenceWorst();
            const best = corona.getCoronaIncidenceBest();
            await interaction.editReply(`${overview}\n\n${worst}\n${best}`);
        } else {
            const regionValue = corona.getCoronaIncidenceOfRegion(region);
            await interaction.editReply(regionValue);
        }
    }

    if (interaction.commandName === commands.coronaState.name) {
        await interaction.deferReply();
        const result = corona.getCoronaIncidencePerState();
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.translate.name) {
        const targetLanguage = interaction.options.get('target_language').value;
        const text = interaction.options.get('text').value;

        await interaction.deferReply();
        const result = await translator.translateText(text, targetLanguage);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.languageList.name) {
        const result = await translator.getSupportedLanguages();

        await interaction.deferReply();
        if (typeof result === 'string') {
            await interaction.editReply(result);
        } else {
            await interaction.editReply(result[0]);
            await interaction.channel.send(result[1]);
        }
    }

    if (interaction.commandName === commands.game.name) {
        const title = interaction.options.get('title').value;

        await interaction.deferReply();
        const result = await game.getGameInfo(title);
        if (typeof result === 'string') {
            await interaction.editReply(result);
        } else {
            await interaction.editReply({ embeds: [result] });
        }
    }

    if (interaction.commandName === commands.upcoming.name) {
        const platform = interaction.options.get('platform')?.value;

        await interaction.deferReply();
        const result = await game.getUpcomingGames(platform);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.anime.name) {
        const title = interaction.options.get('title').value;

        await interaction.deferReply();
        const result = await anime.getAnimeInfo(title, anime.Types.ANIME);
        if (typeof result === 'string') {
            await interaction.editReply(result);
        } else {
            await interaction.editReply({ embeds: [result] });
        }
    }

    if (interaction.commandName === commands.manga.name) {
        const title = interaction.options.get('title').value;

        await interaction.deferReply();
        const result = await anime.getAnimeInfo(title, anime.Types.MANGA);
        if (typeof result === 'string') {
            await interaction.editReply(result);
        } else {
            await interaction.editReply({ embeds: [result] });
        }
    }

    if (interaction.commandName === commands.animelist.name) {
        const genre = interaction.options.get('genre').value;

        await interaction.deferReply();
        const result = await anime.getAnimeList(genre);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.train.name) {
        const origin = interaction.options.get('origin').value;
        const destination = interaction.options.get('destination').value;

        await interaction.deferReply();
        const result = await train.searchNextTrain(origin, destination);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.departure.name) {
        const station = interaction.options.get('station').value;

        await interaction.deferReply();
        const result = await train.searchDepartures(station);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.arrival.name) {
        const station = interaction.options.get('station').value;

        await interaction.deferReply();
        const result = await train.searchArrivals(station);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.converter.name) {
        const input = interaction.options.get('input').value;
        const output = interaction.options.get('output').value;
        const amount = interaction.options.get('amount').value;

        await interaction.deferReply();
        const result = await currency.convert(input, output, amount);
        await interaction.editReply(result);
    }

    if (interaction.commandName === commands.play.name) {
        const video = interaction.options.get('video').value;

        await interaction.deferReply();
        if (video.startsWith('https://www.youtube.com/watch') || (video.startsWith('https://youtu.be/'))) {
            const result = await youtube.playVideo(interaction, video);
            if (result[1] === null) {
                await interaction.editReply(result[0]);
            } else {
                await interaction.editReply({ content: result[0], embeds: [result[1]] });
            }
        } else {
            const result = await youtube.searchVideo(interaction, video);
            if (result[1] === null) {
                await interaction.editReply(result[0]);
            } else {
                await interaction.editReply({ content: result[0], embeds: [result[1]] });
            }
        }
    }

    if (interaction.commandName === commands.leave.name) {
        const result = youtube.leaveAudioChannel(interaction);
        await interaction.reply(result);
    }

    if (interaction.commandName === commands.rank.name) {
        await interaction.deferReply();
        await rank.getLevel(interaction);
    }
});

client.on(Events.MessageCreate, (msg) => {
    rank.increaseLevel(msg);
});

client.login(process.env.DISCORD_TOKEN);
