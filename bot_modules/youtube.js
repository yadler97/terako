const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { MessageEmbed } = require('discord.js');

var isReady = true;

const playVideo = function(msg) {
    if (isReady) {
        if (msg.channel.type === "dm") {
            msg.channel.send("Dieser Befehl kann nur im Audiokanal eines Servers genutzt werden");
        } else {
            isReady = false;
            var voiceChannel = msg.member.voice.channel;
            if (voiceChannel != null) {
                voiceChannel.join().then(connection => {
                    let videourl = msg.content.substring(msg.toString().indexOf(' ') + 1);
                    const dispatcher = connection.play(ytdl(videourl, { quality: 'highestaudio' }));
                    ytdl(videourl).on('info', (info) => {
                        msg.channel.send("**" + info.videoDetails.title + "** wird jetzt abgespielt");
                        let lengthSeconds = info.videoDetails.lengthSeconds;
                        let minutes = lengthSeconds / 60;
                        let seconds = lengthSeconds % 60;
                        let time = minutes.toFixed(0) + ":" + seconds.toString().padStart(2, "0")
                        const embed = new MessageEmbed()
                            .setTitle(info.videoDetails.title)
                            .setThumbnail(info.videoDetails.thumbnails[4].url)
                            .setURL(info.videoDetails.video_url)
                            .setColor(0xff0000)
                            .addField("Uploader", info.videoDetails.author.name, inline = true)
                            .addField("Upload Date", info.videoDetails.publishDate, inline = true)
                            .addField("Duration", time, inline = true)
					    msg.channel.send(embed);
                    });
                    dispatcher.on("end", end => {
                        voiceChannel.leave(); 
                    });
                }).catch(err => {
                    console.log(err);
                    voiceChannel.leave();
                    msg.channel.send("Ungültiger YouTube-Link");
                });
            } else {
                msg.channel.send("Kein Nutzer im Audiokanal");
            }
            isReady = true;
        }
    }
}

const searchVideo = async function(msg) {
    const searchResults = await ytsr(msg.content.substring(msg.toString().indexOf(' ') + 1));
    msg.content = ">A " + searchResults.items.filter(video => video.type == 'video')[0].url
    playVideo(msg)
}

const leaveAudioChannel = function(msg) {
    if (msg.channel.type === "dm") {
        msg.channel.send("Dieser Befehl kann nur im Audiokanal eines Servers genutzt werden");
    } else {
        var voiceChannel = msg.member.voice.channel;
        if (voiceChannel != null) {
            voiceChannel.leave();
        } else {
            msg.channel.send("Kein Nutzer im Audiokanal");
        }
    }
}

module.exports = {
    playVideo,
    searchVideo,
    leaveAudioChannel
}