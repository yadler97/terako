const { XMLHttpRequest } = require('xmlhttprequest');

const localization = require('../localization');

const envLang = localization.getLang();

function convert(inputCurrency, outputCurrency, value) {
    if (inputCurrency === undefined || outputCurrency === undefined || value === undefined) {
        return localization.translate('invalid_value');
    }

    const number = parseFloat(value.replace(',', '.'), 10);
    if (Number.isNaN(number)) {
        return localization.translate('invalid_value');
    }

    const request = new XMLHttpRequest();
    request.open('GET', `https://open.er-api.com/v6/latest/${inputCurrency}`, false);
    request.send();

    const result = JSON.parse(request.responseText);
    if (result.result === 'error' || result.rates[outputCurrency] === undefined) {
        return localization.translate('invalid_iso_format');
    }

    const convertedValue = result.rates[outputCurrency] * number;
    return `${localization.translate('conversion_result')}: ${value.toLocaleString(envLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${inputCurrency} ${localization.translate('are')} ${convertedValue.toLocaleString(envLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${outputCurrency}`;
}

module.exports = {
    convert,
};
