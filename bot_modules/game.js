const { XMLHttpRequest } = require('xmlhttprequest');
const stringSimilarity = require('string-similarity');

const { EmbedBuilder } = require('discord.js');

const localization = require('../localization');

function getGameInfo(searchTerm) {
    const request = new XMLHttpRequest();
    request.open('POST', 'https://api.igdb.com/v4/games', false);
    request.setRequestHeader('Client-ID', process.env.IGDB_CLIENT_ID);
    request.setRequestHeader('Authorization', `Bearer ${process.env.IGDB_TOKEN}`);
    request.send(`fields name,release_dates.human,platforms.name,platforms.platform_family,summary,url,genres.name,cover.image_id,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,aggregated_rating,screenshots.image_id; limit 10; search "${searchTerm}";`);

    if (request.status === 401) {
        return localization.translate('igdb_not_reachable_at_the_moment');
    } if (request.responseText === '[]') {
        return localization.translate('no_game_found');
    }

    let data = JSON.parse(request.responseText);
    const games = data.map((game) => game.name);

    const matches = stringSimilarity.findBestMatch(searchTerm, games);
    data = data[matches.bestMatchIndex];

    const platforms = data.platforms ? data.platforms.map((platform) => platform.name).join(', ') : localization.translate('unknown_dev');
    const genres = data.genres ? data.genres.map((genre) => genre.name).join(', ') : localization.translate('unknown_dev');
    const developersData = data.involved_companies ? data.involved_companies.filter((studio) => studio.developer) : [];
    const publishersData = data.involved_companies ? data.involved_companies.filter((studio) => studio.publisher) : [];
    const developers = developersData.length !== 0 ? developersData.map((studio) => studio.company.name).join(', ') : localization.translate('unknown_dev');
    const publishers = publishersData.length !== 0 ? publishersData.map((studio) => studio.company.name).join(', ') : localization.translate('unknown_dev');
    const releaseDate = data.release_dates ? data.release_dates[0].human : localization.translate('unknown_dev');
    const platformFamilies = data.platforms ? data.platforms.map((platform) => platform.platform_family) : [];

    let color = 0x000000;
    if (platformFamilies.includes(2) && !platformFamilies.includes(1) && !platformFamilies.includes(5)) {
        color = 0x107c11;
    } else if (platformFamilies.includes(1) && !platformFamilies.includes(2) && !platformFamilies.includes(5)) {
        color = 0x006fcd;
    } else if (platformFamilies.includes(5) && !platformFamilies.includes(2) && !platformFamilies.includes(1)) {
        color = 0xff0000;
    }

    const embed = new EmbedBuilder()
        .setTitle(data.name)
        .setImage(data.screenshots ? `https://images.igdb.com/igdb/image/upload/t_original/${data.screenshots[0].image_id}.jpg` : null)
        .setThumbnail(data.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${data.cover.image_id}.jpg` : null)
        .setURL(data.url)
        .setColor(color)
        .addFields(
            { name: localization.translate('platforms'), value: platforms },
            { name: localization.translate('release_date'), value: releaseDate },
            { name: localization.translate('genres'), value: genres },
            { name: localization.translate('developer'), value: developers },
            { name: localization.translate('publisher'), value: publishers },
            { name: localization.translate('rating'), value: data.aggregated_rating ? `${data.aggregated_rating.toFixed(0)}%` : localization.translate('no_rating_found') },
        )
        .setDescription(data.summary !== undefined ? data.summary : localization.translate('no_description_found'));

    return embed;
}

function getUpcomingGames(platform) {
    const platformData = getPlatformID(platform);
    const platformName = platformData !== null ? platformData.name : null;
    const platformId = platformData !== null ? platformData.id : null;
    const currentTime = Math.floor(Date.now() / 1000);

    const request = new XMLHttpRequest();
    request.open('POST', 'https://api.igdb.com/v4/games', false);
    request.setRequestHeader('Client-ID', process.env.IGDB_CLIENT_ID);
    request.setRequestHeader('Authorization', `Bearer ${process.env.IGDB_TOKEN}`);
    request.send(`fields name,hypes,first_release_date,release_dates.human,platforms; limit 10; sort hypes desc; where hypes > 0 & first_release_date > ${currentTime} & platforms = [${platformId}];`);

    if (request.status === 401) {
        return localization.translate('igdb_not_reachable_at_the_moment');
    } if (request.responseText === '[]') {
        return localization.translate('no_games_found_for_platform', { platformName });
    }

    let result;
    if (platformName !== null) {
        result = `${localization.translate('most_anticipated_upcoming_games_for_platform', { platformName })}:\n\`\`\``;
    } else {
        result = `${localization.translate('most_anticipated_upcoming_games')}:\n\`\`\``;
    }

    const data = JSON.parse(request.responseText);
    for (let i = 0; i < data.length; i += 1) {
        result += `${(i + 1)}. ${data[i].name} (${localization.translate('release_date')}: ${data[i].release_dates[0].human})\n`;
    }

    result += '```';
    return result;
}

function getPlatformID(platform) {
    if (platform !== undefined) {
        const request = new XMLHttpRequest();
        request.open('POST', 'https://api.igdb.com/v4/platforms', false);
        request.setRequestHeader('Client-ID', process.env.IGDB_CLIENT_ID);
        request.setRequestHeader('Authorization', `Bearer ${process.env.IGDB_TOKEN}`);
        request.send(`fields name; limit 1; search "${platform}";`);

        if (request.status !== 401 && request.responseText !== '[]') {
            const data = JSON.parse(request.responseText);
            return data[0];
        }
    }

    return null;
}

module.exports = {
    getGameInfo,
    getUpcomingGames,
};
