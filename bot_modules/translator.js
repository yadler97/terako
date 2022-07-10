const { translate, lang } = require('bing-translate-api');

const { XMLHttpRequest } = require('xmlhttprequest');
const cheerio = require('cheerio');

const localization = require('../localization');

const translateText = function translateText(msg, message, resultLang) {
    if (!lang.isSupported(resultLang)) {
        msg.channel.send(localization.translate('language_not_supported'));
    } else if (message === '') {
        msg.channel.send(localization.translate('no_text_to_translate_entered'));
    } else {
        translate(message, null, resultLang, true).then((res) => {
            msg.channel.send(res.translation);
        }).catch((err) => {
            console.error(err);
        });
    }
};

function crawlLanguages(languages) {
    return new Promise((resolve) => {
        const request = new XMLHttpRequest();
        request.open('GET', `https://docs.microsoft.com/${localization.getLang()}/azure/cognitive-services/translator/language-support`);
        request.addEventListener('load', () => {
            const $ = cheerio.load(request.responseText);

            $('table:first').each(function extractLink() {
                $(this.children[3].children).each(function extractLink2() {
                    if ($(this).html() != null) {
                        languages[$(this.children[3]).text()] = $(this.children[1]).text();
                    }
                });
            });
            resolve();
        });
        request.send();
    });
}

const getSupportedLanguages = async function getSupportedLanguages(msg) {
    const languages = {};
    await crawlLanguages(languages);
    if (Object.keys(languages).length > 0) {
        const dataArr = Object.entries(languages);
        const lanuagesOne = Object.fromEntries(dataArr.slice(0, Object.keys(languages).length / 2));
        const lanuagesTwo = Object.fromEntries(dataArr.slice(Object.keys(languages).length / 2));

        let result = `${localization.translate('supported_languages')}:\n\`\`\`\n`;
        for (const [key, value] of Object.entries(lanuagesOne)) {
            result += `${(key + Array(12).join(' ')).substring(0, 12)}${value}\n`;
        }
        result += '```';
        msg.channel.send(result);

        let result2 = '```\n';
        for (const [key, value] of Object.entries(lanuagesTwo)) {
            result2 += `${(key + Array(12).join(' ')).substring(0, 12)}${value}\n`;
        }
        result2 += '```';
        msg.channel.send(result2);
    } else {
        msg.channel.send(localization.translate('no_supported_languages_found'));
    }
};

module.exports = {
    translateText,
    getSupportedLanguages,
};
