const { XMLHttpRequest } = require('xmlhttprequest');

const localization = require('../localization');

const envLang = localization.getLang();

const urls = {
    OVERVIEW: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN,Death,Fallzahl,cases7_bl&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json',
    RANKING: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k,BL&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json',
    REGIONAL: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json',
    STATE: 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=cases7_bl_per_100k,LAN_ew_GEN&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json',
};

function getCoronaIncidenceAndDeaths() {
    const request = new XMLHttpRequest();
    request.open('GET', urls.OVERVIEW, false);
    request.send();

    let data = JSON.parse(request.responseText);
    data = data.features;

    if (data != null) {
        return `${localization.translate('current_seven_day_incidence_in_germany')}: ${(data.map((bl) => bl.attributes.cases7_bl).reduce((a, b) => a + b) / (83166711 / 100000)).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${localization.translate('total_cases')}: ${data.map((bl) => bl.attributes.Fallzahl).reduce((a, b) => a + b).toLocaleString(envLang)}\n\
${localization.translate('total_death_cases')}: ${data.map((bl) => bl.attributes.Death).reduce((a, b) => a + b).toLocaleString(envLang)}`;
    }

    return localization.translate('no_data_found');
}

function getCoronaIncidenceBest() {
    const request = new XMLHttpRequest();
    request.open('GET', urls.RANKING, false);
    request.send();

    let data = JSON.parse(request.responseText);
    data = data.features;

    if (data != null) {
        data.sort((a, b) => a.attributes.cases7_per_100k - b.attributes.cases7_per_100k);

        let result = `${localization.translate('counties_with_lowest_seven_day_incidence')}:\n\`\`\``;

        for (const county of data.slice(0, 5)) {
            result += `${(`${county.attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(county.attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(county.attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n`;
        }

        result += '```';
        return result;
    }

    return localization.translate('no_data_found');
}

function getCoronaIncidenceWorst() {
    const request = new XMLHttpRequest();
    request.open('GET', urls.RANKING, false);
    request.send();

    let data = JSON.parse(request.responseText);
    data = data.features;

    if (data != null) {
        data.sort((a, b) => a.attributes.cases7_per_100k - b.attributes.cases7_per_100k).reverse();

        let result = `${localization.translate('current_corona_hotspots')}:\n\`\`\``;

        for (const county of data.slice(0, 5)) {
            result += `${(`${county.attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(county.attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(county.attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n`;
        }

        result += '```';
        return result;
    }

    return localization.translate('no_data_found');
}

function getCoronaIncidenceOfRegion(regionName) {
    const request = new XMLHttpRequest();
    request.open('GET', urls.REGIONAL, false);
    request.send();

    let data = JSON.parse(request.responseText);
    data = data.features;

    if (data != null) {
        const county = data.reverse().filter((originalData) => originalData.attributes.county.toLowerCase().includes(regionName.toLowerCase()));
        if (county.length === 0) {
            return localization.translate('no_county_or_city_found');
        }

        return `${localization.translate('current_seven_day_incidence')} ${county[0].attributes.county.replace('SK ', `${localization.translate('in_the_city_of')} `).replace('LK ', `${localization.translate('in_the_county_of')} `).replace('Region H', localization.translate('in_the_region_of_h')).replace('StadtRegion', localization.translate('in_the_city_region'))}: ${parseFloat(county[0].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
    }

    return localization.translate('no_data_found');
}

function getCoronaIncidencePerState() {
    const request = new XMLHttpRequest();
    request.open('GET', urls.STATE, false);
    request.send();

    let data = JSON.parse(request.responseText);
    data = data.features;

    if (data != null) {
        data.sort((a, b) => a.attributes.cases7_bl_per_100k - b.attributes.cases7_bl_per_100k).reverse();

        let result = `${localization.translate('current_seven_day_incidence_per_state')}:\n\`\`\``;

        for (const state of data) {
            result += `${(state.attributes.LAN_ew_GEN + Array(45).join(' ')).substring(0, 45) + parseFloat(state.attributes.cases7_bl_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n`;
        }

        result += '```';
        return result;
    }

    return localization.translate('no_data_found');
}

function getStateAbbreviation(state) {
    switch (state) {
    case 'Baden-Württemberg':
        return 'BW';
    case 'Bayern':
        return 'BY';
    case 'Berlin':
        return 'BE';
    case 'Brandenburg':
        return 'BB';
    case 'Bremen':
        return 'HB';
    case 'Hamburg':
        return 'HH';
    case 'Hessen':
        return 'HE';
    case 'Mecklenburg-Vorpommern':
        return 'MV';
    case 'Niedersachsen':
        return 'NI';
    case 'Nordrhein-Westfalen':
        return 'NW';
    case 'Rheinland-Pfalz':
        return 'RP';
    case 'Saarland':
        return 'SL';
    case 'Sachsen':
        return 'SN';
    case 'Sachsen-Anhalt':
        return 'ST';
    case 'Schleswig-Holstein':
        return 'SH';
    case 'Thüringen':
        return 'TH';
    default:
        return state;
    }
}

function getRegions() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json', false);
    request.send();

    let data = JSON.parse(request.responseText);
    data = data.features;

    const result = [];

    if (data != null) {
        for (const region of data) {
            result.push({ name: region.attributes.county, value: region.attributes.county });
        }
    }

    return result;
}

module.exports = {
    getCoronaIncidenceAndDeaths,
    getCoronaIncidenceBest,
    getCoronaIncidenceWorst,
    getCoronaIncidenceOfRegion,
    getCoronaIncidencePerState,
    getRegions,
};
