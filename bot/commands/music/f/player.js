const qc = require("./queue");
const config = require("../../../../config.json");
const snek = require("snekfetch");

const play = async (song, client, message) => {
    return new Promise(async (resolve, reject) => {
        if(!client.queue[message.guild.id]) new qc(message.guild.id, client);
        let queue = client.queue[message.guild.id];
        let player = await client.player.get(message.guild.id);
        if (!player) player = await client.player.join({
            guild: message.guild.id,
            channel: message.member.voiceChannel.id,
            host: config.lavalink.host
        }, { selfdeaf: true });

        if(player.playing) {
            queue.songs.push(song);
            resolve("queue");
        } else {
            player.play(song.track);
            Object.assign(song, {date: Date.now()});
            queue.np = song;
            resolve("play");
        }

        player.once("end", data => {
            if(queue.loop) {
                let song = queue.np;
                song.date = Date.now();
                song.requester = "Loop";
                play(song, client, message);
                return;
            }
            let next = queue.songs.shift();
            if(next == null) {
                return;
            } else {
                setTimeout(() => {
                    play(next, client, message);
                }, 400);
            }
            return;
        });
    });
}

const getSong = async string => {
    return new Promise(async (resolve, reject) => {
        const res = await snek.get(`http://${config.lavalink.host}:${config.lavalink.restport}/loadtracks?identifier=${encodeURIComponent(string)}`)
        .set("Authorization", config.lavalink.password)
        .catch(err => {
            console.error(err);
            return null;
        });
        if (!res) throw "There was an error, try again";
        resolve(res.body);
    });
}

module.exports.play = play;
module.exports.getSong = getSong;