const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let env_lang = "de-DE" //process.env.LANG.substring(0,5).replace("_", "-")

const getCoronaIncidenceAndDeaths = function(msg) {
    var request_bl = new XMLHttpRequest();
    request_bl.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=LAN_ew_GEN,Death,Fallzahl,cases7_bl&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request_bl.addEventListener('load', function(event) {
        var data = JSON.parse(request_bl.responseText);
        data = data['features']

        msg.channel.send("Aktuelle 7-Tage-Inzidenz in Deutschland: " + (data.map(bl => bl.attributes.cases7_bl).reduce((a, b) => a + b) / (83166711/100000)).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
Fälle gesamt: " + data.map(bl => bl.attributes.Fallzahl).reduce((a, b) => a + b).toLocaleString(env_lang) + "\n\
Todesfälle gesamt: " + data.map(bl => bl.attributes.Death).reduce((a, b) => a + b).toLocaleString(env_lang))
    });
    request_bl.send();
}

const getCoronaIncidenceBest = function(msg) {
    var request = new XMLHttpRequest();
    request.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request.addEventListener('load', function(event) {
        var data = JSON.parse(request.responseText);
        data = data['features']

        data.sort(function (a, b) {
            return a.attributes.cases7_per_100k - b.attributes.cases7_per_100k;
        });

        msg.channel.send("Landkreise und Städte mit der niedrigsten Inzidenz:\n```\
" + (data[0].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[0].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[1].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[1].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[2].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[2].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[3].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[3].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[4].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[4].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "```\n\
        ")
    });
    request.send();
}

const getCoronaIncidenceWorst = function(msg) {
    var request = new XMLHttpRequest();
    request.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request.addEventListener('load', function(event) {
        var data = JSON.parse(request.responseText);
        data = data['features']

        data.sort(function (a, b) {
            return a.attributes.cases7_per_100k - b.attributes.cases7_per_100k;
        }).reverse();

        /*for (let city of data) {
            console.log(city.attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis"), parseFloat(city.attributes.cases7_per_100k).toFixed(1))
        }*/

        msg.channel.send("Aktuelle Corona-Hotspots:\n```\
" + (data[0].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[0].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[1].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[1].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[2].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[2].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[3].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[3].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n\
" + (data[4].attributes.county.replace("SK", "Stadt").replace("LK", "Landkreis") + Array(45).join(' ')).substring(0, 45) + parseFloat(data[4].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "```\n\
        ")
    });
    request.send();
}

const getCoronaIncidenceOfRegion = function(msg) {
    var request = new XMLHttpRequest();
    request.open("GET","https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,cases7_per_100k&returnGeometry=false&returnDistinctValues=true&outSR=4326&f=json");
    request.addEventListener('load', function(event) {
        var data = JSON.parse(request.responseText);
        data = data['features'];

        let msgtext = msg.content.substring(msg.toString().indexOf(' ') + 1);
        let county = data.reverse().filter(function(original_data) {
            return original_data.attributes.county.toLowerCase().includes(msgtext.toLowerCase())
        });
        if (county.length == 0) {
            msg.channel.send("Kein Landkreis oder Stadt gefunden")
        } else {
            msg.channel.send("Aktueller 7-Tage-Inzidenzwert " + county[0].attributes.county.replace("SK ", "in der Stadt ").replace("LK ", "im Landkreis ").replace("Region H", "in der Region H").replace("StadtRegion", "in der StadtRegion") + ": " + parseFloat(county[0].attributes.cases7_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}))
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

        data.sort(function (a, b) {
            return a.attributes.cases7_bl_per_100k - b.attributes.cases7_bl_per_100k;
        }).reverse();

        let result = "Aktuelle 7-Tage-Inzidenz nach Bundesländern:\n```"

        for (let state of data) {
            result += (state.attributes.LAN_ew_GEN + Array(45).join(' ')).substring(0, 45) + parseFloat(state.attributes.cases7_bl_per_100k).toLocaleString(env_lang, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "\n"
        }

        result += "```"
        msg.channel.send(result)
    });
    request_bl.send();
}

module.exports = {
    getCoronaIncidenceAndDeaths,
    getCoronaIncidenceBest,
    getCoronaIncidenceWorst,
    getCoronaIncidenceOfRegion,
    getCoronaIncidencePerState
}