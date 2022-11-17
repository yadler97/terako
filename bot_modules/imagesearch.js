const { XMLHttpRequest } = require('xmlhttprequest');

const localization = require('../localization');

function searchImage(message) {
    const request = new XMLHttpRequest();
    const searchTerm = encodeURI(message);
    request.open('GET', `https://api.bing.microsoft.com/v7.0/images/search?q=${searchTerm}`, false);
    request.setRequestHeader('Ocp-Apim-Subscription-Key', process.env.BING_KEY);
    request.send();

    const values = [];
    if (request.status === 200 && request.responseText !== '[]') {
        for (const result in JSON.parse(request.responseText).value) {
            values.push(JSON.parse(request.responseText).value[result].contentUrl);
        }
    }

    if (values.length === 0) {
        return localization.translate('no_image_found');
    }
    const randomnumber = Math.floor(Math.random() * values.length);
    return values[randomnumber];
}

module.exports = {
    searchImage,
};
