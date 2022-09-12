const fetch = require('node-fetch');

const { MessageEmbed } = require('discord.js');

const localization = require('../localization');

function getAnimeInfo(msg, searchTerm, type) {
    const query = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (id: $id, search: $search, type: $type) {
                id
                title {
                    romaji
                    english
                    native
                }
                coverImage {
                    large
                }
                bannerImage
                description
                siteUrl
                episodes
                season
                seasonYear
                studios {
                    nodes {
                        name
                        isAnimationStudio
                    }
                }
                genres
                averageScore
                type
            }
        }
    }
    `;

    const variables = {
        search: searchTerm,
        page: 1,
        perPage: 1,
        type,
    };

    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    };

    fetch(url, options)
        .then(handleResponse)
        .catch(handleError);

    function handleResponse(response) {
        return response.json().then((json) => {
            if (response.ok) {
                const animeData = json.data.Page.media[0];
                if (type === 'ANIME') {
                    const studios = animeData.studios.nodes.filter((studio) => studio.isAnimationStudio).map((studio) => studio.name).join(', ');
                    const embed = new MessageEmbed()
                        .setTitle(animeData.title.romaji)
                        .setImage(animeData.bannerImage)
                        .setThumbnail(animeData.coverImage.large)
                        .setURL(animeData.siteUrl)
                        .setColor(0x9932cc)
                        .addField(localization.translate('episodes'), animeData.episodes)
                        .addField(localization.translate('genres'), animeData.genres.join(', '))
                        .addField(localization.translate('season'), animeData.season && animeData.seasonYear ? `${animeData.season} ${animeData.seasonYear}` : localization.translate('unknown_season'))
                        .addField(localization.translate('studios'), studios || localization.translate('unknown_studio'))
                        .addField(localization.translate('average_score'), animeData.averageScore ? `${animeData.averageScore}%` : localization.translate('no_rating_found'))
                        .setDescription(animeData.description.replace(/<\/?[^>]+(>|$)/g, ''));
                    msg.channel.send(embed);
                } else {
                    const embed = new MessageEmbed()
                        .setTitle(animeData.title.romaji)
                        .setImage(animeData.bannerImage)
                        .setThumbnail(animeData.coverImage.large)
                        .setURL(animeData.siteUrl)
                        .setColor(0xff7f00)
                        .addField(localization.translate('genres'), animeData.genres.join(', '))
                        .addField(localization.translate('average_score'), animeData.averageScore ? `${animeData.averageScore}%` : localization.translate('no_rating_found'))
                        .setDescription(animeData.description.replace(/<\/?[^>]+(>|$)/g, ''));
                    msg.channel.send(embed);
                }
            }

            return response.ok ? json.data.Page.media : Promise.reject(json);
        });
    }

    function handleError(error) {
        console.error(error);
        if (type === 'ANIME') {
            msg.channel.send(localization.translate('no_anime_found'));
        } else {
            msg.channel.send(localization.translate('no_manga_found'));
        }
    }
}

function getAnimeList(msg, genre) {
    const query = `
    query ($id: Int, $page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $genre: [String]) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
            }
            media (id: $id, season: $season, seasonYear: $seasonYear, genre_in: $genre) {
                id
                title {
                    romaji
                    english
                    native
                }
                description
                siteUrl
                season
                seasonYear
                studios {
                    nodes {
                        name
                        isAnimationStudio
                    }
                }
                genres
                averageScore
            }
        }
    }
      `;

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    let season; let seasonYear;

    switch (month) {
    case 1:
    case 2:
        season = 'WINTER';
        seasonYear = year;
        break;
    case 3:
    case 4:
    case 5:
        season = 'SPRING';
        seasonYear = year;
        break;
    case 6:
    case 7:
    case 8:
        season = 'SUMMER';
        seasonYear = year;
        break;
    case 9:
    case 10:
    case 11:
        season = 'FALL';
        seasonYear = year;
        break;
    case 12:
        season = 'WINTER';
        seasonYear = year + 1;
        break;
    default:
        season = 'WINTER';
        seasonYear = year;
        break;
    }

    const variables = {
        season,
        seasonYear,
        genre,
        page: 1,
        perPage: 50,
    };

    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    };

    fetch(url, options)
        .then(handleResponse)
        .catch(handleError);

    function handleResponse(response) {
        return response.json().then((json) => {
            if (response.ok) {
                const animeData = json.data.Page.media;
                if (animeData.length === 0) {
                    msg.channel.send(localization.translate('no_anime_found_in_season_with_genre', { season, seasonYear, genre }));
                } else {
                    msg.channel.send(`${localization.translate('current_animes_in_season', { season, seasonYear, genre })}:\n\n${animeData.map((anime) => `∙ ${anime.title.romaji}`).join('\n')}`);
                }
            }

            return response.ok ? json.data.Page.media : Promise.reject(json);
        });
    }

    function handleError(error) {
        console.error(error);
        msg.channel.send(localization.translate('no_anime_found'));
    }
}

module.exports = {
    getAnimeInfo,
    getAnimeList,
};
