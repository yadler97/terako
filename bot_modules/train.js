const createClient = require('hafas-client');
const dbProfile = require('hafas-client/p/db');
const localization = require('../localization');

// create a client with the Deutsche Bahn profile
const client = createClient(dbProfile, 'crsbdx');

function convertTime(time) {
    return new Date(time).toLocaleTimeString(localization.getLang(), { hour: 'numeric', minute: 'numeric' });
}

async function searchNextTrain(origin, destination) {
    const resOrigin = await client.locations(origin, { results: 1 });
    const resDestination = await client.locations(destination, { results: 1 });

    const originStation = resOrigin[0].name;
    const destinationStation = resDestination[0].name;

    const res = await client.journeys(
        resOrigin[0].id,
        resDestination[0].id,
        { results: 5, products: { regional: true, suburban: true } },
    ).catch(() => localization.translate('no_connections_found', { originStation, destinationStation }));

    if (res.journeys.length !== 0) {
        let response = `${localization.translate('next_trains_from_to', { originStation, destinationStation })}:\n\n`;

        for (const journey of res.journeys) {
            if (journey.legs[0].line !== undefined) {
                const changes = journey.legs.slice(1).filter((leg) => !leg.walking).map((leg) => leg.origin.name);
                let changesText = '';
                let departureDelayText = '';
                let arrivalDelayText = '';
                let platformText = '';
                if (changes.length !== 0) {
                    changesText = ` (${localization.translate('changes_in')}: ${changes.join(', ')})`;
                }
                if (journey.legs[0].departureDelay !== null && journey.legs[0].departureDelay !== 0) {
                    departureDelayText = ` (${localization.translate('time_today')}: ${convertTime(journey.legs[0].departure)}${localization.translate('time')})`;
                }
                if (journey.legs[journey.legs.length - 1].arrivalDelay !== null && journey.legs[journey.legs.length - 1].arrivalDelay !== 0) {
                    arrivalDelayText = ` (${localization.translate('time_today')}: ${convertTime(journey.legs[journey.legs.length - 1].arrival)}${localization.translate('time')})`;
                }
                if (journey.legs[0].departurePlatform !== null) {
                    platformText = ` ${localization.translate('from_platform')} ${journey.legs[0].departurePlatform}`;
                }

                response += `• **${journey.legs[0].line.name}** - ${localization.translate('departure')} **${convertTime(journey.legs[0].plannedDeparture)}${localization.translate('time')}**${departureDelayText}${platformText} - ${localization.translate('arrival')} **${convertTime(journey.legs[journey.legs.length - 1].plannedArrival)}${localization.translate('time')}**${arrivalDelayText}${changesText}\n`;
            }
        }

        return response;
    }

    return localization.translate('no_connections_found', { originStation, destinationStation });
}

async function searchDepartures(station) {
    const resStation = await client.locations(station, { results: 1 });
    const originStation = resStation[0].name;

    const res = await client.departures(
        resStation[0].id,
        { results: 5, products: { regional: true, suburban: true } },
    ).catch(() => localization.translate('no_trains_from_found', { originStation }));

    if (res.length !== 0) {
        let response = `${localization.translate('next_trains_from', { originStation })}:\n\n`;

        for (const journey of res) {
            if (journey.line !== undefined) {
                let delayText = '';
                let platformText = '';
                if (journey.delay !== null && journey.delay !== 0) {
                    delayText = ` (${localization.translate('time_today')}: ${convertTime(journey.when)}${localization.translate('time')})`;
                }
                if (journey.plannedPlatform !== null) {
                    platformText = ` ${localization.translate('from_platform')} ${journey.plannedPlatform}`;
                }

                response += `• **${journey.line.name}** ${localization.translate('direction')} **${journey.destination.name}** - ${localization.translate('departure')} **${convertTime(journey.plannedWhen)}${localization.translate('time')}**${delayText}${platformText}\n`;
            }
        }

        return response;
    }

    return localization.translate('no_trains_from_found', { originStation });
}

async function searchArrivals(station) {
    const resStation = await client.locations(station, { results: 1 });
    const destinationStation = resStation[0].name;

    const res = await client.arrivals(
        resStation[0].id,
        { results: 5, products: { regional: true, suburban: true } },
    ).catch(() => localization.translate('no_trains_to_found', { destinationStation }));

    if (res.length !== 0) {
        let response = `${localization.translate('next_trains_to', { destinationStation })}:\n\n`;

        for (const journey of res) {
            if (journey.line !== undefined) {
                let delayText = '';
                let platformText = '';
                if (journey.delay !== null && journey.delay !== 0) {
                    delayText = ` (${localization.translate('time_today')}: ${convertTime(journey.when)}${localization.translate('time')})`;
                }
                if (journey.plannedPlatform !== null) {
                    platformText = ` ${localization.translate('on_platform')} ${journey.plannedPlatform}`;
                }

                response += `• **${journey.line.name}** ${localization.translate('from')} **${journey.provenance}** - ${localization.translate('arrival')} **${convertTime(journey.plannedWhen)}${localization.translate('time')}**${delayText}${platformText}\n`;
            }
        }

        return response;
    }

    return localization.translate('no_trains_to_found', { destinationStation });
}

module.exports = {
    searchNextTrain,
    searchDepartures,
    searchArrivals,
};
