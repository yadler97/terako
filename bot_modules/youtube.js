const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { EmbedBuilder } = require('discord.js');

const {
    joinVoiceChannel,
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
const localization = require('../localization');

let isReady = true;

const player = createAudioPlayer();

player.on('error', (error) => {
    console.error(`Error: ${error.message}`);
});

async function connectToChannel(interaction, channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    try {
        // await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

async function playVideo(interaction, videourl) {
    if (isReady) {
        const voiceChannel = interaction.member.voice.channel;
        if (voiceChannel != null) {
            const info = await ytdl.getBasicInfo(videourl).catch((err) => {
                console.error(err);
                return null;
            });

            if (info === null) {
                return [localization.translate('invalid_youtube_link'), null];
            }

            isReady = false;
            const connection = await connectToChannel(interaction, voiceChannel);
            connection.subscribe(player);

            const resource = createAudioResource(ytdl(videourl, {
                quality: 'highestaudio', dlChunkSize: 1 << 12,
            }), {
                inputType: StreamType.WebmOpus,
            });

            player.play(resource, { type: 'opus' });
            // entersState(player, AudioPlayerStatus.Playing, 5000);

            const text = `**${info.videoDetails.title}** ${localization.translate('is_now_playing')}`;
            const { lengthSeconds } = info.videoDetails;
            const minutes = lengthSeconds / 60;
            const seconds = lengthSeconds % 60;
            const time = `${minutes.toFixed(0)}:${seconds.toString().padStart(2, '0')}`;
            const embed = new EmbedBuilder()
                .setTitle(info.videoDetails.title)
                .setThumbnail(info.videoDetails.thumbnails[3].url)
                .setURL(info.videoDetails.video_url)
                .setColor(0xff0000)
                .addFields(
                    { name: localization.translate('uploader'), value: info.videoDetails.author.name, inline: true },
                    { name: localization.translate('upload_date'), value: new Date(info.videoDetails.publishDate).toLocaleDateString(localization.getLang()), inline: true },
                    { name: localization.translate('duration'), value: time, inline: true },
                );

            isReady = true;
            return [text, embed];
        }

        return [localization.translate('no_user_in_voice_channel'), null];
    }

    return [localization.translate('bot_not_ready'), null];
}

async function searchVideo(interaction, searchTerm) {
    const voiceChannel = interaction.member.voice.channel;
    if (voiceChannel != null) {
        const searchResults = await ytsr(searchTerm);
        const videourl = searchResults.items.filter((video) => video.type === 'video')[0].url;
        return playVideo(interaction, videourl);
    }

    return [localization.translate('no_user_in_voice_channel'), null];
}

function leaveAudioChannel(interaction) {
    const voiceChannel = getVoiceConnection(interaction.guild.id);
    if (voiceChannel != null) {
        voiceChannel.disconnect();
        return localization.translate('voice_channel_successfully_left');
    }

    return localization.translate('no_user_in_voice_channel');
}

module.exports = {
    playVideo,
    searchVideo,
    connectToChannel,
    leaveAudioChannel,

    player,
};
