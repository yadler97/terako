const { XMLHttpRequest } = require('xmlhttprequest');
const stringSimilarity = require('string-similarity');

const { MessageEmbed } = require('discord.js');

const localization = require('../localization');

const getGameInfo = function getGameInfo(msg) {
    const msgtext = msg.content.substring(msg.toString().indexOf(' ') + 1);

    const request = new XMLHttpRequest();
    request.open('POST', 'https://api.igdb.com/v4/games');
    request.setRequestHeader('Client-ID', process.env.IGDB_CLIENT_ID);
    request.setRequestHeader('Authorization', `Bearer ${process.env.IGDB_TOKEN}`);
    request.addEventListener('load', () => {
        if (request.status === 401) {
            msg.channel.send(localization.translate('igdb_not_reachable_at_the_moment'));
        } else if (request.responseText === '[]') {
            msg.channel.send(localization.translate('no_game_found'));
        } else {
            let data = JSON.parse(request.responseText);
            const games = data.map((game) => game.name);

            const matches = stringSimilarity.findBestMatch(msgtext, games);
            data = data[matches.bestMatchIndex];

            const platforms = data.platforms.map((platform) => platform.name).join(', ');
            const genres = data.genres.map((genre) => genre.name).join(', ');
            const developers = data.involved_companies ? data.involved_companies.filter((studio) => studio.developer).map((studio) => studio.company.name).join(', ') : localization.translate('unknown_dev');
            const publishers = data.involved_companies ? data.involved_companies.filter((studio) => studio.publisher).map((studio) => studio.company.name).join(', ') : localization.translate('unknown_dev');
            const platformFamilies = data.platforms.map((platform) => platform.platform_family);

            let color = 0x000000;
            if (platformFamilies.includes(2) && !platformFamilies.includes(1) && !platformFamilies.includes(5)) {
                color = 0x107c11;
            } else if (platformFamilies.includes(1) && !platformFamilies.includes(2) && !platformFamilies.includes(5)) {
                color = 0x006fcd;
            } else if (platformFamilies.includes(5) && !platformFamilies.includes(2) && !platformFamilies.includes(1)) {
                color = 0xff0000;
            }

            const embed = new MessageEmbed()
                .setTitle(data.name)
                .setImage(data.screenshots ? `https://images.igdb.com/igdb/image/upload/t_original/${data.screenshots[0].image_id}.jpg` : null)
                .setThumbnail(data.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${data.cover.image_id}.jpg` : null)
                .setURL(data.url)
                .setColor(color)
                .addField(localization.translate('platforms'), platforms)
                .addField(localization.translate('release_date'), data.release_dates[0].human)
                .addField(localization.translate('genres'), genres)
                .addField(localization.translate('developer'), developers)
                .addField(localization.translate('publisher'), publishers)
                .addField(localization.translate('rating'), data.aggregated_rating ? `${data.aggregated_rating.toFixed(0)}%` : localization.translate('no_rating_found'))
                .setDescription(data.summary);
            msg.channel.send(embed);
        }
    });
    request.send(`fields name,release_dates.human,platforms.name,platforms.platform_family,summary,url,genres.name,cover.image_id,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,aggregated_rating,screenshots.image_id; limit 10; search "${msgtext}";`);
};

module.exports = {
    getGameInfo,
};
