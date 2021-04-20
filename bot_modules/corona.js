const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let env_lang = "de-DE" //process.env.LANG.substring(0,5).replace("_", "-")

const getCoronaIncidenceAndDeaths = function(msg) {
    var request_bl = new XMLHttpRequest();
    request_bl.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN,Death,Fallzahl,cases7_bl&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request_bl.addEventListener('load', function(event) {
        var data = JSON.parse(request_bl.responseText);
        data = data['features']

        if (data != null) {
            msg.channel.send("Aktuelle 7-Tage-Inzidenz in Deutschland: " + (data.map(bl => bl.attributes.cases7_bl).reduce((a, b) => a + b) / (83166711/100000)).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
Fälle gesamt: " + data.map(bl => bl.attributes.Fallzahl).reduce((a, b) => a + b).toLocaleString(env_lang) + "\n\
Todesfälle gesamt: " + data.map(bl => bl.attributes.Death).reduce((a, b) => a + b).toLocaleString(env_lang))
        } else {
            msg.channel.send("Keine Daten gefunden")
        }
    });
    request_bl.send();
}

const getCoronaIncidenceBest = function(msg) {
    var request = new XMLHttpRequest();
    request.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k,BL&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request.addEventListener('load', function(event) {
        var data = JSON.parse(request.responseText);
        data = data['features']

        if (data != null) {
            data.sort(function (a, b) {
                return a.attributes.cases7_per_100k - b.attributes.cases7_per_100k;
            });

            msg.channel.send("Landkreise und Städte mit der niedrigsten Inzidenz:\n```\
" + (data[0].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[0].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[0].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[1].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[1].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[1].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[2].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[2].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[2].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[3].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[3].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[3].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[4].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[4].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[4].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "```\n\
            ")
        }
    });
    request.send();
}

const getCoronaIncidenceWorst = function(msg) {
    var request = new XMLHttpRequest();
    request.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k,BL&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request.addEventListener('load', function(event) {
        var data = JSON.parse(request.responseText);
        data = data['features']

        if (data != null) {
            data.sort(function (a, b) {
                return a.attributes.cases7_per_100k - b.attributes.cases7_per_100k;
            }).reverse();

            /*for (let city of data) {
                console.log(city.attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis"), parseFloat(city.attributes.cases7_per_100k).toFixed(1))
            }*/

            msg.channel.send("Aktuelle Corona-Hotspots:\n```\
" + (data[0].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[0].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[0].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[1].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[1].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[1].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[2].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[2].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[2].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[3].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[3].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[3].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[4].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + " (" + getStateAbbreviation(data[4].attributes.BL) + ")" + Array(40).join(' ')).substring(0, 40) + parseFloat(data[4].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "```\n\
            ")
        }
    });
    request.send();
}

const getCoronaIncidenceOfRegion = function(msg) {
    var request = new XMLHttpRequest();
    request.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request.addEventListener('load', function(event) {
        var data = JSON.parse(request.responseText);
        data = data['features'];

        if (data != null) {
            let msgtext = msg.content.substring(msg.toString().indexOf(' ') + 1);
            let county = data.reverse().filter(function(original_data) {
                return original_data.attributes.county.toLowerCase().includes(msgtext.toLowerCase())
            });
            if (county.length == 0) {
                msg.channel.send("Kein Landkreis oder Stadt gefunden")
            } else {
                msg.channel.send("Aktueller 7-Tage-Inzidenzwert " + county[0].attributes.county.replace("SK ", "in der Stadt ").replace("LK ", "im Landkreis ").replace("Region H", "in der Region H").replace("StadtRegion", "in der StadtRegion") + ": " + parseFloat(county[0].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}))
            }
        } else {
            msg.channel.send("Keine Daten gefunden")
        }
    });
    request.send();
}

const getCoronaIncidencePerState = function(msg) {
    var request_bl = new XMLHttpRequest();
    request_bl.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=cases7_bl_per_100k,LAN_ew_GEN&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request_bl.addEventListener('load', function(event) {
        var data = JSON.parse(request_bl.responseText);
        data = data['features']

        if (data != null) {
            data.sort(function (a, b) {
                return a.attributes.cases7_bl_per_100k - b.attributes.cases7_bl_per_100k;
            }).reverse();

            let result = "Aktuelle 7-Tage-Inzidenz nach Bundesländern:\n```"

            for (let state of data) {
                result += (state.attributes.LAN_ew_GEN + Array(45).join(' ')).substring(0, 45) + parseFloat(state.attributes.cases7_bl_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n"
            }

            result += "```"
            msg.channel.send(result)
        } else {
            msg.channel.send("Keine Daten gefunden")
        }
    });
    request_bl.send();
}

const state_population = {"de.bw":11100394, "de.by":13124737, "de.be":3669491, "de.bb":2521893, "de.hb":681202, "de.hh":1847253, "de.he":6288080, "de.mv":1608138, "de.ni":7993608, "de.nw":17947221, "de.rp":4093903, "de.sl":986887, "de.sn":4071971, "de.st":2194782, "de.sh":2903773, "de.th":2133378, "de":83166711}

const getVaccinationStatus = function(msg) {
    var request_vac = new XMLHttpRequest();
    request_vac.open("GET", "https://interaktiv.morgenpost.de/data/corona/rki-vaccination.json");
    request_vac.addEventListener('load', function(event) {
        var data = JSON.parse(request_vac.responseText);

        if (data != null) {
            let result = "Aktuelle Impfquote nach Bundesländern:\n```Land                               Erstimpfungen            Vollständige Impfungen\n"

            for (let state of data) {
                console.log(state.cumsum_latest, state_population[state.id])
                result += (state.name + Array(35).join(' ')).substring(0, 35) + (parseFloat((state.cumsum_latest-state.cumsum2_latest)/state_population[state.id]*100).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + " %" + Array(25).join(' ')).substring(0, 25) + parseFloat(state.cumsum2_latest/state_population[state.id]*100).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + " %\n"
            }

            result += "```"
            msg.channel.send(result)
        } else {
            msg.channel.send("Keine Daten gefunden")
        }
    });
    request_vac.send();
}

const getStateAbbreviation = function(state) {
    switch (state) {
        case "Baden-Württemberg":
            return "BW"
        case "Bayern":
            return "BY"
        case "Berlin":
            return "BE"
        case "Brandenburg":
            return "BB"
        case "Bremen":
            return "HB"
        case "Hamburg":
            return "HH"
        case "Hessen":
            return "HE"
        case "Mecklenburg-Vorpommern":
            return "MV"
        case "Niedersachsen":
            return "NI"
        case "Nordrhein-Westfalen":
            return "NW"
        case "Rheinland-Pfalz":
            return "RP"
        case "Saarland":
            return "SL"
        case "Sachsen":
            return "SN"
        case "Sachsen-Anhalt":
            return "ST"
        case "Schleswig-Holstein":
            return "SH"
        case "Thüringen":
            return "TH"
        default:
            return state
    }
}

module.exports = {
    getCoronaIncidenceAndDeaths,
    getCoronaIncidenceBest,
    getCoronaIncidenceWorst,
    getCoronaIncidenceOfRegion,
    getCoronaIncidencePerState,
    getVaccinationStatus
}