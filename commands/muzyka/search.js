const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var index = require("../../index.js");
const snekfetch = require("snekfetch");

module.exports.run = async (client, message, args) => {
    if(args[0] == null) {message.reply("nie mam co wyszukać"); return;}
    var text = args.slice(0).join(" ");
    await getSong(`ytsearch:${text}`, async songs => {
        if(songs.loadType == "NO_MATCHES") {message.reply("nie znaleziono!"); return;}

        var eb = new Discord.RichEmbed;
        eb.setColor("#FFAA");
        eb.setTitle("Wybierz wynik wyszukiwania wpisując `1`-`10` lub `anuluj`, aby anulować");
        eb.setDescription("Wyniki wyszukiwania:");
        var c = 0;
        songs.tracks.forEach(s => {
            c++;
            if(c >= 11) return;
            eb.addField(c + ". " + s.info.title, "Kanał: " + s.info.author);
        });
        eb.setFooter("Czas na odpowiedź: 30sek");
        var msearch = null;
        message.channel.send(eb).then(mes => msearch = mes);
        let collector = message.channel.createMessageCollector(m => m, {time: 30000});
        collector.on("collect", async m => {
            if(m.author != message.author) return;
            if(m.content.startsWith("anuluj")) {collector.stop(); message.channel.send("Wyszukiwanie anulowano!"); return;}
            c = 0;
            var zn = false;
            songs.tracks.forEach(async song => {
                if (zn == true) return;
                c++;
                if(c >= 11) return;
                if(Number(m.content) == c) {
                    var vChannel = message.member.voiceChannel;
                    if(vChannel == null) {
                        message.reply("najpierw wejdź na kanał głosowy!");
                        return;
                    }
                    var player = await client.player.get(message.guild.id);
                    if (!player) player = await client.player.join({
                        guild: message.guild.id,
                        channel: message.member.voiceChannel.id,
                        host: config.lavalink.host
                    }, { selfdeaf: true });
                    zn = true;
                    collector.stop();
                    let queue = queuefile.getqueue;
                    if (player.playing) {
                        queuefile.addsong(message.guild.id, song.track, song.info.uri, song.info.title, song.info.length, song.info.author, message.author.username);
                        message.channel.send("<:mplus:488416560445390878> | Dodano do kolejki: `" + song.info.title + "` z **" + song.info.author + "**");
                    } else {
                        player.play(song.track);
                        queue[message.guild.id].playing = true;
                        queuefile.song(message.guild.id, song.info.title, song.info.author, song.info.length, message.author.username, song.info.uri, song.track, Date.now());
                        message.channel.send("<:mplay:488399581470785557> | Odtwarzanie: `" + song.info.title + "` z **" + song.info.author + "**");
                    }
                    player.once("error", err => message.channel.send(err.error));
                    player.once("end", data => {
                        var next = queue[message.guild.id].songs.shift();
                        if(next == null) {
                            queue[message.guild.id].playing = false;
                        } else {
                            setTimeout(() => {
                                player.play(next.track);
                                queuefile.song(message.guild.id, next.title, next.channel, next.length, next.requester, next.uri, next.track, Date.now());
                            }, 400);
                        }
                        return;
                    });
                }
            });
        });
        collector.on("stop", () => {
            msearch.delete();
        });
    });
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
    name:"search",
    category:"MUZYKA"
}