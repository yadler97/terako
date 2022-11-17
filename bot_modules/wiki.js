const { XMLHttpRequest } = require('xmlhttprequest');

const localization = require('../localization');

function getPageSnippet(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();

    if (request.status >= 200 && request.status < 300) {
        const data = JSON.parse(request.responseText);
        const key = Object.keys(data.query.pages)[0];

        if (Object.prototype.hasOwnProperty.call(data.query.pages[key], 'extract')) {
            const categoryArray = data.query.pages[key].categories.filter((item) => item.title === 'Kategorie:Begriffsklärung');
            let string = data.query.pages[key].extract;
            string = string.replace(/&amp;/g, '&').replace(/<b>/g, '**').replace(/<\/b>/g, '**');
            if (categoryArray.length === 0) {
                if (string.split('</p>')[0].length < 200) {
                    if (string.split('</p>')[0].includes('<span>Vorlage:Infobox')) {
                        string = string.split('</p>')[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
                    } else {
                        string = `${string.split('</p>')[0].replace(/<\/?[^>]+(>|$)/g, '').trim()}\n\n${string.split('</p>')[1].replace(/<\/?[^>]+(>|$)/g, '').trim()}`;
                    }
                } else {
                    string = string.split('</p>')[0].replace(/<\/?[^>]+(>|$)/g, '').trim();
                }
            } else {
                string = string.replace(/<li>/g, '- ').replace(/<p>/g, '\n\n').replace(/<\/?[^>]+(>|$)/g, '').trim();
                if (string.includes('\n\n**Siehe auch')) {
                    string = string.split('\n\n**Siehe auch')[0];
                }
            }

            const trimmedString = string.length > 1900 ? `${string.substring(0, 1900 - 3)}...` : string;
            const pageTitle = encodeURI(data.query.pages[key].title);
            return `${trimmedString}\n\n${localization.translate('more_here')}: *${process.env.MEDIAWIKI_URL}wiki/${pageTitle}*`;
        }

        return localization.translate('no_wikipedia_article_found');
    }

    console.warn(request.statusText, request.responseText);
    return localization.translate('no_wikipedia_article_found');
}

function getRandomArticle() {
    const url = `${process.env.MEDIAWIKI_URL}w/api.php?%20format=json&action=query&prop=categories|extracts&generator=random&grnnamespace=0`;
    return getPageSnippet(url);
}

function getArticle(searchTerm) {
    let urlSearchTerm = encodeURI(searchTerm);
    const re = /[+]/g;
    urlSearchTerm = urlSearchTerm.replace(re, '%2B').replace('&', '%26');
    const url = `${process.env.MEDIAWIKI_URL}w/api.php?action=query&format=json&prop=categories|extracts&redirects=true&titles=${urlSearchTerm}`;
    return getPageSnippet(url);
}

module.exports = {
    getArticle,
    getRandomArticle,
};
