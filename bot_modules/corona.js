const { XMLHttpRequest } = require('xmlhttprequest');

const localization = require('../localization');

const envLang = localization.getLang();

function getCoronaIncidenceAndDeaths(msg) {
    const requestBl = new XMLHttpRequest();
    requestBl.open('GET', 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN,Death,Fallzahl,cases7_bl&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json');
    requestBl.addEventListener('load', () => {
        let data = JSON.parse(requestBl.responseText);
        data = data.features;

        if (data != null) {
            msg.channel.send(`${localization.translate('current_seven_day_incidence_in_germany')}: ${(data.map((bl) => bl.attributes.cases7_bl).reduce((a, b) => a + b) / (83166711 / 100000)).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${localization.translate('total_cases')}: ${data.map((bl) => bl.attributes.Fallzahl).reduce((a, b) => a + b).toLocaleString(envLang)}\n\
${localization.translate('total_death_cases')}: ${data.map((bl) => bl.attributes.Death).reduce((a, b) => a + b).toLocaleString(envLang)}`);
        } else {
            msg.channel.send(localization.translate('no_data_found'));
        }
    });
    requestBl.send();
}

function getCoronaIncidenceBest(msg) {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k,BL&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json');
    request.addEventListener('load', () => {
        let data = JSON.parse(request.responseText);
        data = data.features;

        if (data != null) {
            data.sort((a, b) => a.attributes.cases7_per_100k - b.attributes.cases7_per_100k);

            msg.channel.send(`${localization.translate('counties_with_lowest_seven_day_incidence')}:\n\`\`\`\
${(`${data[0].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[0].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[0].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[1].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[1].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[1].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[2].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[2].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[2].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[3].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[3].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[3].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[4].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[4].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[4].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\`\`\`\n\
            `);
        }
    });
    request.send();
}

function getCoronaIncidenceWorst(msg) {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k,BL&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json');
    request.addEventListener('load', () => {
        let data = JSON.parse(request.responseText);
        data = data.features;

        if (data != null) {
            data.sort((a, b) => a.attributes.cases7_per_100k - b.attributes.cases7_per_100k).reverse();

            msg.channel.send(`${localization.translate('current_corona_hotspots')}:\n\`\`\`\
${(`${data[0].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[0].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[0].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[1].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[1].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[1].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[2].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[2].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[2].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[3].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[3].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[3].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n\
${(`${data[4].attributes.county.replace('SK', localization.translate('city_of')).replace('LK', localization.translate('county_of'))} (${getStateAbbreviation(data[4].attributes.BL)})${Array(45).join(' ')}`).substring(0, 45)}${parseFloat(data[4].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\`\`\`\n\
            `);
        }
    });
    request.send();
}

function getCoronaIncidenceOfRegion(msg, regionName) {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json');
    request.addEventListener('load', () => {
        let data = JSON.parse(request.responseText);
        data = data.features;

        if (data != null) {
            const county = data.reverse().filter((originalData) => originalData.attributes.county.toLowerCase().includes(regionName.toLowerCase()));
            if (county.length === 0) {
                msg.channel.send(localization.translate('no_county_or_city_found'));
            } else {
                msg.channel.send(`${localization.translate('current_seven_day_incidence')} ${county[0].attributes.county.replace('SK ', `${localization.translate('in_the_city_of')} `).replace('LK ', `${localization.translate('in_the_county_of')} `).replace('Region H', localization.translate('in_the_region_of_h')).replace('StadtRegion', localization.translate('in_the_city_region'))}: ${parseFloat(county[0].attributes.cases7_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`);
            }
        } else {
            msg.channel.send(localization.translate('no_data_found'));
        }
    });
    request.send();
}

function getCoronaIncidencePerState(msg) {
    const requestBl = new XMLHttpRequest();
    requestBl.open('GET', 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=cases7_bl_per_100k,LAN_ew_GEN&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json');
    requestBl.addEventListener('load', () => {
        let data = JSON.parse(requestBl.responseText);
        data = data.features;

        if (data != null) {
            data.sort((a, b) => a.attributes.cases7_bl_per_100k - b.attributes.cases7_bl_per_100k).reverse();

            let result = `${localization.translate('current_seven_day_incidence_per_state')}:\n\`\`\``;

            for (const state of data) {
                result += `${(state.attributes.LAN_ew_GEN + Array(45).join(' ')).substring(0, 45) + parseFloat(state.attributes.cases7_bl_per_100k).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}\n`;
            }

            result += '```';
            msg.channel.send(result);
        } else {
            msg.channel.send(localization.translate('no_data_found'));
        }
    });
    requestBl.send();
}

const statePopulation = {
    'de.bw': 11100394, 'de.by': 13124737, 'de.be': 3669491, 'de.bb': 2521893, 'de.hb': 681202, 'de.hh': 1847253, 'de.he': 6288080, 'de.mv': 1608138, 'de.ni': 7993608, 'de.nw': 17947221, 'de.rp': 4093903, 'de.sl': 986887, 'de.sn': 4071971, 'de.st': 2194782, 'de.sh': 2903773, 'de.th': 2133378, de: 83166711,
};

function getVaccinationStatus(msg) {
    const requestVac = new XMLHttpRequest();
    requestVac.open('GET', 'https://interaktiv.morgenpost.de/data/corona/rki-vaccination.json');
    requestVac.addEventListener('load', () => {
        const data = JSON.parse(requestVac.responseText);

        if (data != null) {
            let result = `${localization.translate('current_vaccination_rate_per_state')}:\n\`\`\`${localization.translate('state')}                               ${localization.translate('single_vaccinated')}            ${localization.translate('fully_vaccinatied')}\n`;

            for (const state of data) {
                result += `${(state.name + Array(35).join(' ')).substring(0, 35) + (`${parseFloat(((state.cumsum_latest - state.cumsum2_latest) / statePopulation[state.id]) * 100).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %${Array(25).join(' ')}`).substring(0, 25) + parseFloat((state.cumsum2_latest / statePopulation[state.id]) * 100).toLocaleString(envLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %\n`;
            }

            result += '```';
            msg.channel.send(result);
        } else {
            msg.channel.send(localization.translate('no_data_found'));
        }
    });
    requestVac.send();
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

module.exports = {
    getCoronaIncidenceAndDeaths,
    getCoronaIncidenceBest,
    getCoronaIncidenceWorst,
    getCoronaIncidenceOfRegion,
    getCoronaIncidencePerState,
    getVaccinationStatus,
};
