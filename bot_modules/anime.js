const fetch = require("node-fetch");

const { MessageEmbed } = require('discord.js');

const getAnimeInfo = function(msg, type) {
	var query = `
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

	var variables = {
		search: msg.content.substring(msg.toString().indexOf(' ') + 1),
		page: 1,
		perPage: 1,
		type: type
	};

	var url = 'https://graphql.anilist.co',
		options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: variables
			})
		};

	fetch(url, options).then(handleResponse)
						.then(handleData)
						.catch(handleError);

	function handleResponse(response) {
		return response.json().then(function (json) {
			if (response.ok) {
				let anime_data = json.data.Page.media[0];
				if (type == "ANIME") {
					let studios = anime_data.studios.nodes.filter(studio => studio.isAnimationStudio).map(studio => studio.name).join(", ");
					const embed = new MessageEmbed()
						.setTitle(anime_data.title.romaji)
						.setImage(anime_data.bannerImage)
						.setThumbnail(anime_data.coverImage.large)
						.setURL(anime_data.siteUrl)
						.setColor(0x9932cc)
						.addField("Episodes", anime_data.episodes)
						.addField("Genres", anime_data.genres.join(", "))
						.addField("Season", anime_data.season && anime_data.seasonYear ? anime_data.season + " " + anime_data.seasonYear : "unbekannt")
						.addField("Studios", studios ? studios : "unbekannt")
						.addField("Average Score", anime_data.averageScore ? anime_data.averageScore + "%" : "keine Wertung vorhanden")
						.setDescription(anime_data.description.replace(/<\/?[^>]+(>|$)/g, ""));
					msg.channel.send(embed);
				} else {
					const embed = new MessageEmbed()
						.setTitle(anime_data.title.romaji)
						.setImage(anime_data.bannerImage)
						.setThumbnail(anime_data.coverImage.large)
						.setURL(anime_data.siteUrl)
						.setColor(0xff7f00)
						.addField("Genres", anime_data.genres.join(", "))
						.addField("Average Score", anime_data.averageScore ? anime_data.averageScore + "%" : "keine Wertung vorhanden")
						.setDescription(anime_data.description.replace(/<\/?[^>]+(>|$)/g, ""));
					msg.channel.send(embed);
				}
			}

			return response.ok ? json.data.Page.media : Promise.reject(json);
		});
	}

	function handleData(data) {
		console.log(data);
	}

	function handleError(error) {
		console.error(error);
		if (type == "ANIME") {
			msg.channel.send("Kein Anime gefunden");
		} else {
			msg.channel.send("Kein Manga gefunden");
		}
	}
}

const getAnimeList = function(msg) {
	var query = `
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
	  
	let today = new Date();
	let month = today.getMonth() + 1;
	let year = today.getFullYear();
	let season, seasonYear;
	let genre = msg.content.substring(msg.toString().indexOf(' ') + 1);

	switch (month) {
		case 1:
		case 2:
			season = "WINTER";
			seasonYear = year;
			break;
		case 3:
		case 4:
		case 5:
			season = "SPRING";
			seasonYear = year;
			break;
		case 6:
		case 7:
		case 8:
			season = "SUMMER";
			seasonYear = year;
			break;
		case 9:
		case 10:
		case 11:
			season = "FALL";
			seasonYear = year;
			break;
		case 12:
			season = "WINTER";
			seasonYear = year + 1;
			break;
	}
	

	var variables = {
		season: season,
		seasonYear: seasonYear,
		genre: genre,
		page: 1,
		perPage: 50
	};

	var url = 'https://graphql.anilist.co',
		options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: query,
				variables: variables
			})
		};

	fetch(url, options).then(handleResponse)
						.then(handleData)
						.catch(handleError);

	function handleResponse(response) {
		return response.json().then(function (json) {
			if (response.ok) {
				let anime_data = json.data.Page.media;
				if (anime_data.length == 0) {
					msg.channel.send("Kein Anime in Season " + season + " " + seasonYear + " im Genre " + genre + " gefunden")
				} else {
					msg.channel.send("Aktuelle Animes in Season " + season + " " + seasonYear + " im Genre " + genre + ":\n\n" + anime_data.map(anime => "∙ " + anime.title.romaji).join("\n"))
				}
			}

			return response.ok ? json.data.Page.media : Promise.reject(json);
		});
	}

	function handleData(data) {
		console.log(data);
	}

	function handleError(error) {
		console.error(error);
		msg.channel.send("Kein Anime gefunden");
	}
}

module.exports = {
	getAnimeInfo,
	getAnimeList
}