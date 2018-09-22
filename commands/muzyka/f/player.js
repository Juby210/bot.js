var queuefile = require("./queue.js");

module.exports.play = async (track, client, message) => await play(track, client, message);

async function play(track, client, message) {
    let queue = queuefile.getqueue;
    var player = await client.player.get(message.guild.id);
    if (!player) player = await client.player.join({
        guild: message.guild.id,
        channel: message.member.voiceChannel.id,
        host: config.lavalink.host
    }, { selfdeaf: true });
    player.play(track);
    queue[message.guild.id].playing = true;

    player.once("error", err => message.channel.send(err.error));
    player.once("end", data => {
        var next = queue[message.guild.id].songs.shift();
        if(next == null) {
            queue[message.guild.id].playing = false;
        } else {
            setTimeout(() => {
                play(next.track, client, message);
                queuefile.song(message.guild.id, next.title, next.channel, next.length, next.requester, next.url, next.track, Date.now());
            }, 400);
        }
        return;
    });
}