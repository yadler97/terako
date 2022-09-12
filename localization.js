const i18next = require('i18next');

const fs = require('fs');

const langFileEN = JSON.parse(fs.readFileSync('./translation/en.json', 'utf8'));
const langFileDE = JSON.parse(fs.readFileSync('./translation/de.json', 'utf8'));

function getLang() {
    if (process.env.IS_HEROKU) {
        return 'de-DE';
    }
    return Intl.DateTimeFormat().resolvedOptions().locale;
}

i18next.init({
    lng: getLang(),
    fallbackLng: 'en',
    resources: {
        en: {
            translation: langFileEN,
        },
        de: {
            translation: langFileDE,
        },
    },
});

function translate(key, args) {
    return i18next.t(key, args);
}

module.exports = {
    translate,
    getLang,
};
