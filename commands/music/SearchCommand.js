const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var index = require("../../index.js");
const yt = require('ytdl-core');
var youtubeSearch = require('youtube-search');
var player = require("./f/player.js");

module.exports.run = async (client, message, args) => {
    if(args[0] == null) {message.reply("nie mam co wyszukać"); return;}
    var text = args.slice(0).join(" ");
    youtubeSearch(text, {maxResults: 15, key: config.ytapikey}, (err, results) => {
        if(err) {index.anticrash(message.channel, err, false); return;}
         
        if(results.length == 0) {msg.reply("nie znaleziono!"); return;}
        var eb = new Discord.RichEmbed;
        eb.setColor("#FFAA");
        eb.setTitle("Wybierz wynik wyszukiwania wpisując `1`-`10` lub `anuluj`, aby anulować");
        eb.setDescription("Wyniki wyszukiwania:");
        var c = 0;
        results.forEach(r => {
            if(r.title == r.channelTitle) return;
            c++;
            if(c >= 11) return;
            eb.addField(c + ". " + r.title, "Kanał: " + r.channelTitle);
        });
        eb.setFooter("Czas na odpowiedź: 30sek");
        var msearch = null;
        message.channel.send(eb).then(mes => msearch = mes);
        let collector = message.channel.createMessageCollector(m => m, {time: 30000});
        collector.on("collect", m => {
            if(m.author != message.author) return;
            if(m.content.startsWith("anuluj")) {collector.stop(); message.channel.send("Wyszukiwanie anulowano!"); return;}
            c = 0;
            var zn = false;
            results.forEach(r => {
                if(r.title == r.channelTitle) return;
                if (zn == true) return;
                c++;
                if(c >= 11) return;
                if(Number(m.content) == c) {
                    var vChannel = message.member.voiceChannel;
                    if(vChannel == null) {
                        message.reply("najpierw wejdź na kanał głosowy!");
                        return;
                    } else {
                        if (message.guild.member(client.user).voiceChannel != vChannel) {
                            vChannel.join().catch(err => anticrash(message.channel, err));
                        }
                    }
                    zn = true;
                    collector.stop();
                    let queue = queuefile.getqueue;
                    if (queue[m.guild.id].playing) {
                        player.getTimestamp(r.id, timestamp => {
                            queuefile.addsong(m.guild.id, r.link, r.title, message.author.username, timestamp, r.id)
                        });
                        m.channel.send("Dodano do kolejki: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                    } else {
                        m.channel.send("Odtwarzanie: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                        player.getTimestamp(r.id, timestamp => {
                            player.play(m, {url: r.link, title: r.title, requester: message.author.username, duration: timestamp, id: r.id});
                        });
                    }
                }
            });
        });
        collector.on("end", () => {
            msearch.delete();
        });
    });
}

module.exports.help = {
    name:"search",
    category:"MUZYKA"
}