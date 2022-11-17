const { translate, lang } = require('bing-translate-api');

const { XMLHttpRequest } = require('xmlhttprequest');
const cheerio = require('cheerio');

const localization = require('../localization');

async function translateText(text, targetLanguage) {
    if (!lang.isSupported(targetLanguage)) {
        return localization.translate('language_not_supported');
    }

    return translate(text, null, targetLanguage, true)
        .then((res) => res.translation)
        .catch((err) => {
            console.error(err);
            return localization.translate('could_not_translate_text');
        });
}

function crawlLanguages() {
    const languages = {};
    const request = new XMLHttpRequest();
    request.open('GET', `https://learn.microsoft.com/${localization.getLang()}/azure/cognitive-services/translator/language-support`, false);
    request.send();

    const $ = cheerio.load(request.responseText);

    $('table:first').each(function extractLink() {
        $(this.children[3].children).each(function extractLink2() {
            if ($(this).html() != null) {
                languages[$(this.children[3]).text()] = $(this.children[1]).text();
            }
        });
    });

    return languages;
}

async function getSupportedLanguages() {
    const languages = crawlLanguages();

    if (Object.keys(languages).length > 0) {
        const dataArr = Object.entries(languages);
        const lanuagesOne = Object.fromEntries(dataArr.slice(0, Object.keys(languages).length / 2));
        const lanuagesTwo = Object.fromEntries(dataArr.slice(Object.keys(languages).length / 2));

        let result = `${localization.translate('supported_languages')}:\n\`\`\`\n`;
        for (const [key, value] of Object.entries(lanuagesOne)) {
            result += `${(key + Array(12).join(' ')).substring(0, 12)}${value}\n`;
        }
        result += '```';

        let result2 = '```\n';
        for (const [key, value] of Object.entries(lanuagesTwo)) {
            result2 += `${(key + Array(12).join(' ')).substring(0, 12)}${value}\n`;
        }
        result2 += '```';

        return [result, result2];
    }

    return localization.translate('no_supported_languages_found');
}

module.exports = {
    translateText,
    getSupportedLanguages,
};
