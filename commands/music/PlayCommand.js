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
        if(err) {player.search(text, message); return;}
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