const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const { MessageEmbed } = require('discord.js');

const getGameInfo = function(msg) {
    let msgtext = msg.content.substring(msg.toString().indexOf(' ') + 1);

    var request = new XMLHttpRequest();
    request.open("POST", "https://api.igdb.com/v4/games");
    request.setRequestHeader("Client-ID", process.env.CLIENT_ID);
    request.setRequestHeader("Authorization", "Bearer " + process.env.ACCESS_TOKEN);
    request.addEventListener('load', function(event) {
        if (request.responseText == "[]") {
            msg.channel.send("Kein Spiel gefunden");
        } else {
            var data = JSON.parse(request.responseText)[0];
            let platforms = data.platforms.map(platform => platform.name).join(", ");
            let genres = data.genres.map(genre => genre.name).join(", ");
            let developers = data.involved_companies.filter(studio => studio.developer).map(studio => studio.company.name).join(", ");
            let publishers = data.involved_companies.filter(studio => studio.publisher).map(studio => studio.company.name).join(", ");
            let platform_families = data.platforms.map(platform => platform.platform_family);

            let color = 0x000000
            if (platform_families.includes(2) && !platform_families.includes(1) && !platform_families.includes(5)) {
                color = 0x107c11
            } else if (platform_families.includes(1) && !platform_families.includes(2) && !platform_families.includes(5)) {
                color = 0x006fcd
            } else if (platform_families.includes(5) && !platform_families.includes(2) && !platform_families.includes(1)) {
                color = 0xff0000
            }

            const embed = new MessageEmbed()
                .setTitle(data.name)
                .setImage("https://images.igdb.com/igdb/image/upload/t_original/" + data.screenshots[0].image_id + ".jpg")
                .setThumbnail("https://images.igdb.com/igdb/image/upload/t_cover_big/" + data.cover.image_id + ".jpg")
                .setURL(data.url)
                .setColor(color)
                .addField("Platforms", platforms)
                .addField("Release Date", data.release_dates[0].human)
                .addField("Genres", genres)
                .addField("Developer", developers)
                .addField("Publisher", publishers)
                .addField("Rating", data.aggregated_rating ? data.aggregated_rating.toFixed(0) + "%" : "keine Wertung vorhanden")
                .setDescription(data.summary);
            msg.channel.send(embed);
        }
    });
    request.send("fields name,release_dates.human,platforms.name,platforms.platform_family,summary,url,genres.name,cover.image_id,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,aggregated_rating,screenshots.image_id,rating_count; limit 1; search \"" + msgtext + "\"; where rating_count != null;");
}

module.exports = {
    getGameInfo
}