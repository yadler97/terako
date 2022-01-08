const { XMLHttpRequest } = require('xmlhttprequest');
// const { MessageEmbed } = require('discord.js');

const getPageSnippet = function (msg, domain, url) {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 300) {
            const data = JSON.parse(request.responseText);
            for (const key in data.query.pages) {
                if (data.query.pages[key].hasOwnProperty('extract')) {
                    const categoryArray = data.query.pages[key].categories.filter((item) => item.title == 'Kategorie:Begriffsklärung');
                    let string = data.query.pages[key].extract;
                    if (categoryArray.length == 0) {
                        if (string.split('</p>')[0].length < 200) {
                            if (string.split('</p>')[0].includes('<span>Vorlage:Infobox')) {
                                string = string.split('</p>')[1].replace(/&amp;/g, '&').replace(/<b>/g, '**').replace(/<\/b>/g, '**').replace(/<\/?[^>]+(>|$)/g, '')
                                .trim();
                            } else {
                                string = `${string.split('</p>')[0].replace(/&amp;/g, '&').replace(/<b>/g, '**').replace(/<\/b>/g, '**').replace(/<\/?[^>]+(>|$)/g, '')
                                .trim()}\n\n${data.query.pages[key].extract.split('</p>')[1].replace(/<b>/g, '**').replace(/<\/b>/g, '**').replace(/<\/?[^>]+(>|$)/g, '').trim()}`;
                            }
                        } else {
                            string = string.split('</p>')[0].replace(/&amp;/g, '&').replace(/<b>/g, '**').replace(/<\/b>/g, '**').replace(/<\/?[^>]+(>|$)/g, '')
                            .trim();
                        }
                    } else {
                        string = string.replace(/&amp;/g, '&').replace(/<li>/g, '- ').replace(/<p>/g, '\n\n').replace(/<b>/g, '**')
                        .replace(/<\/b>/g, '**')
                        .replace(/<\/?[^>]+(>|$)/g, '')
                        .trim();
                        if (string.includes('\n\n**Siehe auch')) {
                            string = string.split('\n\n**Siehe auch')[0];
                        }
                    }

                    const trimmedString = string.length > 1900 ? `${string.substring(0, 1900 - 3)}...` : string;
                    const pageTitle = encodeURI(data.query.pages[key].title);
                    msg.channel.send(`${trimmedString}\n\nMehr unter: *${domain}/wiki/${pageTitle}*`);

                    /* const embed = new MessageEmbed()
                            .setTitle(data.query.pages[key].title)
                            .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Coat_of_arms_of_Berlin.svg/623px-Coat_of_arms_of_Berlin.svg.png")
                            .setURL(url + "/wiki/" + pageTitle)
                            .setColor(0xff0000)
                            .setDescription(trimmedString)
                            .addField("Einwohner", "3.669.491 (31. Dezember 2019)")
                            .addField("Fläche", "891,68 km² (Rang: 14. als Land, 1. als Gemeinde)")
                            .addField("Kfz-Kennzeichen", "B")
                    msg.channel.send(embed); */
                } else {
                    msg.channel.send('Kein Wikipedia-Eintrag gefunden');
                }
            }
        } else {
            console.warn(request.statusText, request.responseText);
        }
    });
    request.send();
};

const getRandomArticle = function (msg, domain) {
    const url = `${domain}/w/api.php?%20format=json&action=query&prop=categories|extracts&generator=random&grnnamespace=0`;
    getPageSnippet(msg, domain, url);
};

const getArticle = function (msg, domain) {
    let msgtext = msg.toString().substring(msg.toString().indexOf(' ') + 1);
    msgtext = encodeURI(msgtext);
    const re = /[+]/g;
    msgtext = msgtext.replace(re, '%2B').replace('&', '%26');
    const url = `${domain}/w/api.php?action=query&format=json&prop=categories|extracts&redirects=true&titles=${msgtext}`;
    getPageSnippet(msg, domain, url);
};

module.exports = {
    getArticle,
    getRandomArticle,
};
