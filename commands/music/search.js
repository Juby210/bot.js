const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var playerf = require("./f/player.js");
const snekfetch = require("snekfetch");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(args[0] == null) {message.reply(`${strings.getMsg("music_search_null")}`); return;}
    var text = args.slice(0).join(" ");
    await getSong(`ytsearch:${text}`, async songs => {
        if(songs.loadType == "NO_MATCHES") {message.reply(`${strings.getMsg("music_search_notfound")}`); return;}

        var eb = new Discord.RichEmbed;
        eb.setColor("#FFAA");
        eb.setTitle(`${strings.getMsg("music_search_title")}`);
        eb.setDescription(`${strings.getMsg("music_search_success")}`);
        var c = 0;
        songs.tracks.forEach(s => {
            c++;
            if(c >= 11) return;
            eb.addField(c + ". " + s.info.title, `${strings.getMsg("music_search_channel")}` + " " + s.info.author);
        });
        eb.setFooter(`${strings.getMsg("music_search_time")}`);
        var msearch = null;
        message.channel.send(eb).then(mes => msearch = mes);
        let collector = message.channel.createMessageCollector(m => m, {time: 30000});
        collector.on("collect", async m => {
            if(m.author != message.author) return;
            if(m.content.startsWith(`${strings.getMsg("music_search_cancel")}`)) {collector.stop(); message.channel.send(`${strings.getMsg("music_channel_exit")}`); return;}
            c = 0;
            var zn = false;
            songs.tracks.forEach(async song => {
                if (zn == true) return;
                c++;
                if(c >= 11) return;
                if(Number(m.content) == c) {
                    var vChannel = message.member.voiceChannel;
                    if(vChannel == null) {
                        message.reply(`${strings.getMsg("music_join")}`);
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
                    if (player.playing) {
                        queuefile.addsong(message.guild.id, song.track, song.info.uri, song.info.title, song.info.length, song.info.author, message.author.username);
                        message.channel.send("<:mplus:488416560445390878> | " + `${strings.getMsg("music_added").replace("#SONG#", song.info.title.replace(/`/g, "'")).replace("#CHANNEL#", song.info.author)}`);
                    } else {
                        playerf.play(song.track, client, message);
                        queuefile.song(message.guild.id, song.info.title, song.info.author, song.info.length, message.author.username, song.info.uri, song.track, Date.now());
                        message.channel.send("<:mplay:488399581470785557> | " + `${strings.getMsg("music_playing_play").replace("#SONG#", song.info.title.replace(/`/g, "'").replace("#CHANNEL#", song.info.author))}`);
                    }
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
    name:"search"
}