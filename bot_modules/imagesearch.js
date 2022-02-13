const { XMLHttpRequest } = require('xmlhttprequest');

const localization = require('../localization');

const searchImage = async function searchImage(msg, message) {
    const request = new XMLHttpRequest();
    const searchTerm = encodeURI(message);
    request.open('GET', `https://api.bing.microsoft.com/v7.0/images/search?q=${searchTerm}`);
    request.setRequestHeader('Ocp-Apim-Subscription-Key', process.env.BING_KEY);
    request.addEventListener('load', () => {
        const values = [];
        for (const result in JSON.parse(request.responseText).value) {
            values.push(JSON.parse(request.responseText).value[result].contentUrl);
        }

        if (values.length === 0) {
            msg.channel.send(localization.translate('no_image_found'));
        } else {
            const randomnumber = Math.floor(Math.random() * values.length);
            msg.channel.send(values[randomnumber]);
        }
    });
    request.send();
};

module.exports = {
    searchImage,
};
