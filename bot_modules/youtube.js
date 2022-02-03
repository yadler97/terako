const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { MessageEmbed } = require('discord.js');

const localization = require('../localization');

let isReady = true;

const playVideo = function playVideo(msg, videourl) {
    if (isReady) {
        if (msg.channel.type === 'dm') {
            msg.channel.send(localization.translate('this_command_can_only_be_used_in_voice_channel'));
        } else {
            isReady = false;
            const voiceChannel = msg.member.voice.channel;
            if (voiceChannel != null) {
                voiceChannel.join().then((connection) => {
                    const dispatcher = connection.play(ytdl(videourl, { quality: 'highestaudio' }));
                    ytdl(videourl).on('info', (info) => {
                        msg.channel.send(`**${info.videoDetails.title}** ${localization.translate('is_now_playing')}`);
                        const { lengthSeconds } = info.videoDetails;
                        const minutes = lengthSeconds / 60;
                        const seconds = lengthSeconds % 60;
                        const time = `${minutes.toFixed(0)}:${seconds.toString().padStart(2, '0')}`;
                        const embed = new MessageEmbed()
                            .setTitle(info.videoDetails.title)
                            .setThumbnail(info.videoDetails.thumbnails[3].url)
                            .setURL(info.videoDetails.video_url)
                            .setColor(0xff0000)
                            .addField(localization.translate('uploader'), info.videoDetails.author.name, true)
                            .addField(localization.translate('upload_date'), new Date(info.videoDetails.publishDate).toLocaleDateString(localization.getLang()), true)
                            .addField(localization.translate('duration'), time, true);
                        msg.channel.send(embed);
                    });
                    dispatcher.on('end', () => {
                        voiceChannel.leave();
                    });
                }).catch((err) => {
                    console.log(err);
                    voiceChannel.leave();
                    msg.channel.send(localization.translate('invalid_youtube_link'));
                });
            } else {
                msg.channel.send(localization.translate('no_user_in_voice_channel'));
            }
            isReady = true;
        }
    }
};

const searchVideo = async function searchVideo(msg, searchTerm) {
    if (msg.channel.type === 'dm') {
        msg.channel.send(localization.translate('this_command_can_only_be_used_in_voice_channel'));
    } else {
        const voiceChannel = msg.member.voice.channel;
        if (voiceChannel != null) {
            const searchResults = await ytsr(searchTerm);
            const videourl = searchResults.items.filter((video) => video.type === 'video')[0].url;
            playVideo(msg, videourl);
        } else {
            msg.channel.send(localization.translate('no_user_in_voice_channel'));
        }
    }
};

const leaveAudioChannel = function leaveAudioChannel(msg) {
    if (msg.channel.type === 'dm') {
        msg.channel.send(localization.translate('this_command_can_only_be_used_in_voice_channel'));
    } else {
        const voiceChannel = msg.member.voice.channel;
        if (voiceChannel != null) {
            voiceChannel.leave();
        } else {
            msg.channel.send(localization.translate('no_user_in_voice_channel'));
        }
    }
};

module.exports = {
    playVideo,
    searchVideo,
    leaveAudioChannel,
};
