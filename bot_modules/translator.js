const { translate, lang } = require('bing-translate-api');

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

module.exports = {
    translateText,
};
