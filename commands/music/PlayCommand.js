const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var index = require("../../index.js");
const yt = require('ytdl-core');
var player = require("./f/player.js");

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    } else {
        if (message.guild.member(client.user).voiceChannel != vChannel) {
            vChannel.join().catch(err => index.anticrash(message.channel, err));
        }
    }
    if(args[0] == null) {message.reply("jakiś linczek by się przydał"); return;}
    yt.getInfo(args[0], (err, info) => {
        var text = args.slice(0).join(" ");
        if(err) {
            if(text.startsWith("http://") || text.startsWith("https://")) {
                let queue = queuefile.getqueue;
                if (queue[message.guild.id].playing) {
                    /*message.channel.send(`Dodano do kolejki: ${text} - radio`);
                    queuefile.addsong(message.guild.id, text, `Radio ${text}`, message.author.username, "LIVE", "radio");*/
                    queue[message.guild.id].songs = [];
                    player.skip(message, false);
                    message.channel.send(`Odtwarzanie: ${text} - radio`);
                    player.playr(text, message);
                } else {
                    message.channel.send(`Odtwarzanie: ${text} - radio`);
                    player.playr(text, message);
                }
            } else {player.search(text, message); return;}
            player.playr(text, message); return;
        }
        let queue = queuefile.getqueue;
        if (queue[message.guild.id].playing) {
            message.channel.send("Dodano do kolejki: `" + info.title + "` z kanału `" + info.author.name + "`");
            player.getTimestamp(info.video_id, timestamp => {
                queuefile.addsong(message.guild.id, args[0], info.title, message.author.username, timestamp, info.video_id);
            });
        } else {
            message.channel.send("Odtwarzanie: `" + info.title + "` z kanału `" + info.author.name + "`");
            player.getTimestamp(info.video_id, timestamp => {
                player.play(message, {url: args[0], title: info.title, requester: message.author.username, duration: timestamp, id: info.video_id});
            });
        }
    });
}

module.exports.help = {
    name:"play",
    category: "MUZYKA"
}