const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var playerf = require("./f/player.js");
const snekfetch = require("snekfetch");
let queue = queuefile.getqueue;

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    if(args[0] == null) {message.reply("jakiś linczek by się przydał"); return;}
    let [...track] = args;
    track = track.join(" ");
    var song;
    var ok = false;
    await getSong(track, async s => {
        if(ok) return;
        if(s.loadType == "NO_MATCHES") {
            var zn = false;
            await getSong(`ytsearch:${track}`, async songs => {
                songs.tracks.forEach(async e => {
                    if(zn) return;
                    song = e;
                    zn = true;
                    await play(e, message, client);
                });
            });
            if(!zn) {
                return message.channel.send("Nie znaleziono.");
            }
        } else if (s.loadType == "PLAYLIST_LOADED") {
            var c = 0;
            s.tracks.forEach(async song => {
                c++;
                var player = await client.player.get(message.guild.id);
                if (!player) player = await client.player.join({
                    guild: message.guild.id,
                    channel: message.member.voiceChannel.id,
                    host: config.lavalink.host
                }, { selfdeaf: true });
                queuefile.addsong(message.guild.id, song.track, song.info.uri, song.info.title, song.info.length, song.info.author, message.author.username);
            });
            message.channel.send("<:mcheck_mark:488416404706426880> | Załadowano `" + c + "` utworów!");
            setTimeout(async () => {
                var player = await client.player.get(message.guild.id);
                if(player.playing) {} else {
                    var song = queue[message.guild.id].songs.shift();
                    if(!song) return;
                    playerf.play(song.track, client, message);
                    queuefile.song(message.guild.id, song.title, song.channel, song.length, song.requester, song.url, song.track, Date.now());
                    message.channel.send("<:mplay:488399581470785557> | Odtwarzanie: `" + song.title + "` z **" + song.channel + "**");
                }
            }, 300);
        } else {
            s.tracks.forEach(async cos => {
                song = cos;
                await play(cos, message, client);
            });
        }
        ok = true;
    });
}

async function play(song, message, client) {
    var player = await client.player.get(message.guild.id);
    if (!player) player = await client.player.join({
        guild: message.guild.id,
        channel: message.member.voiceChannel.id,
        host: config.lavalink.host
    }, { selfdeaf: true });
    if(player.playing) {
        queuefile.addsong(message.guild.id, song.track, song.info.uri, song.info.title, song.info.length, song.info.author, message.author.username);
        message.channel.send("<:mplus:488416560445390878> | Dodano do kolejki: `" + song.info.title + "` z **" + song.info.author + "**");
    } else {
        playerf.play(song.track, client, message);
        queuefile.song(message.guild.id, song.info.title, song.info.author, song.info.length, message.author.username, song.info.uri, song.track, Date.now());
        message.channel.send("<:mplay:488399581470785557> | Odtwarzanie: `" + song.info.title + "` z **" + song.info.author + "**");
    }
}

async function getSong(string, callback) {
    const res = await snekfetch.get(`http://${config.lavalink.host}:${config.lavalink.restport}/loadtracks?identifier=${string}`)
        .set("Authorization", config.lavalink.password)
        .catch(err => {
            console.error(err);
            return null;
        });
    if (!res) throw "There was an error, try again";
    callback(res.body);
}

module.exports.help = {
    name:"play",
    category: "MUZYKA",
    aliases: ">"
}