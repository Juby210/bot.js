const Discord = require("discord.js");
const config = require("../../../config.json");
const prefix = config.prefix;
const index = require("../../../index.js");
var queuefile = require("./queue.js");
let dispatchers = {};
const yt = require('ytdl-core');
var youtubeSearch = require('youtube-search');
var youtube = require("youtube-api");
var client = index.client;

module.exports.play = async (msg, song) => {
    let dispatcher;
    let queue = queuefile.getqueue;
    queue[msg.guild.id].playing = true;
    try {
        dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), {passes: 1, bitrate: 256000});
        dispatcher.setVolume(queue[msg.guild.id].volume / 100);
    } catch(err) {try{dispatcher.end()} catch(err) {} queue[msg.guild.id].playing = false; index.anticrash(msg.channel, err); return;}
    if(!dispatchers.hasOwnProperty(msg.guild.id)) dispatchers[msg.guild.id] = {};
    dispatchers[msg.guild.id].d = dispatcher;
    dispatchers[msg.guild.id].song = song;
    queuefile.update(queue);

    dispatcher.on('error', (err) => {
        queue = queuefile.getqueue;
        queue[msg.guild.id].playing = false;
        queuefile.update(queue);
        index.anticrash(msg.channel, err, false);
        return;
    });
    dispatcher.on('end', () => {
        queue = queuefile.getqueue;
        var next = queue[msg.guild.id].songs.shift();
        if(next == null) {
            queue[msg.guild.id].playing = false;
        } else {
            if(next.id == "radio") {
                require("./player.js").playr(next.url, msg);
            } else {
                require("./player.js").play(msg, next);
            }
        }
        queuefile.update(queue);
        return;
    });
}
module.exports.playr = async (text, msg, title = null) => {
    let dispatcher;
    let queue = queuefile.getqueue;
    queue[msg.guild.id].playing = true;
    try {
        dispatcher = msg.guild.voiceConnection.playStream(text, {passes: 1, bitrate: 256000});
        dispatcher.setVolume(queue[msg.guild.id].volume / 100);
    } catch(err) {try{dispatcher.end()} catch(err) {} queue[msg.guild.id].playing = false; /*search(text, msg);*/ index.anticrash(msg.channel, err, false); return;}
    if(!dispatchers.hasOwnProperty(msg.guild.id)) dispatchers[msg.guild.id] = {};
    dispatchers[msg.guild.id].d = dispatcher;
    if(title == null) title = text;
    dispatchers[msg.guild.id].song = {url: text, title: `Radio - ${title}`, requester: msg.author.username, duration: "LIVE", id: "radio"};
    queuefile.update(queue);

    dispatcher.on('error', (err) => {
        require("./player.js").playr(text, msg, title);
        return;
    });
}

module.exports.pause = async msg => {
    try{
        if(dispatchers[msg.guild.id].d.paused) {
            msg.channel.send("Odtwarzacz aktualinie nie jest zatrzymany.");
        } else {
            dispatchers[msg.guild.id].d.pause();
            msg.react(index.emojiguild.emojis.get("488399581957324800"));
        }
    } catch(err) {msg.channel.send("Bot aktualinie nie gra.");}
}
module.exports.resume = async msg => {
    try{
        if(dispatchers[msg.guild.id].d.paused) {
            dispatchers[msg.guild.id].d.resume();
            msg.react(index.emojiguild.emojis.get("488399581470785557"));
        } else {
            msg.channel.sned("Odtwarzacz aktualnie nie jest zatrzymany.");
        }
    } catch(err) {
        msg.channel.send("Bot aktualinie nie gra.");
    }
}
module.exports.skip = async (msg, r = true) => {
    try{
        dispatchers[msg.guild.id].d.end();
        if(dispatchers[msg.guild.id].song.id == "radio") {
            queue = queuefile.getqueue;
            var next = queue[msg.guild.id].songs.shift();
            if(next == null) {
                queue[msg.guild.id].playing = false;
            } else {
                if(next.id == "radio") {
                    require("./player.js").playr(next.url, msg);
                } else {
                    require("./player.js").play(msg, next);
                }
            }
            queuefile.update(queue);
        }
        if(r) msg.react(index.emojiguild.emojis.get("488399581965451265"));
    } catch(err) {}
}
module.exports.setvolume = async (msg, vol) => {
    try{
        dispatchers[msg.guild.id].d.setVolume(parseInt(vol, 10) / 100);
        queuefile.setvolume(msg.guild.id, vol);
        msg.channel.send(":sound: | Głośność została zmieniona na: **" + vol + "%**")
        msg.react(index.emojiguild.emojis.get("488416404538785809"));
    } catch(err) {}
}
module.exports.np = async (msg, client) => {
    try {
        var song = dispatchers[msg.guild.id].song;
        let dispatcher = dispatchers[msg.guild.id].d;
        let queue = queuefile.getqueue;
        var embed = new Discord.RichEmbed;
        embed.setAuthor("Odtwarzanie: ", client.user.avatarURL);
        embed.setTitle(song.title);
        embed.setDescription("`" + `${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)} / ${song.duration}` + "`");
        embed.setThumbnail(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`);
        embed.setFooter("Dodano przez: " + song.requester);
        msg.channel.send(embed).then(mes => {
            mes.react("⏸").then(() => mes.react("▶").then(() => mes.react("⏩")));
            var col = mes.createReactionCollector((rea, user) => user.id == msg.author.id);
            col.on("collect", (rea, user) => {
                switch (rea.emoji.name) {
                    case "⏸":
                        if(dispatcher.paused) return;
                        dispatcher.pause();
                        break;
                    case "▶":
                        if(!dispatcher.paused) return;
                        dispatcher.resume();
                        break;
                    case "⏩":
                        if(!queue[mes.guild.id].playing) return;
                        dispatcher.end();
                        if(dispatchers[msg.guild.id].song.id == "radio") {
                            queue = queuefile.getqueue;
                            var next = queue[msg.guild.id].songs.shift();
                            if(next == null) {
                                queue[msg.guild.id].playing = false;
                            } else {
                                if(next.id == "radio") {
                                    require("./player.js").playr(next.url, msg);
                                } else {
                                    require("./player.js").play(msg, next);
                                }
                            }
                            queuefile.update(queue);
                        }
                        break;
                    }
                });
            });
    } catch(err) {}
}

module.exports.search = async (text, msg) => {
    var ok = false;
    youtubeSearch(text, {maxReasults: 2, key: config.ytapikey}, (err, results) => {
        if(err) {index.anticrash(msg.channel, err, false); return;}
        
        if(results.length == 0) {msg.reply("nie znaleziono!"); return;}
        results.forEach(r => {
            if(ok) return;
            if(r.title == r.channelTitle) return;
            let queue = queuefile.getqueue;
            if (queue[msg.guild.id].playing) {
                msg.channel.send("<:mplus:488416560445390878> Dodano do kolejki: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                getTimestamp(r.id, timestamp => {
                    queuefile.addsong(msg.guild.id, r.link, r.title, msg.author.username, timestamp, r.id);
                });
            } else {
                getTimestamp(r.id, timestamp => {
                    require("./player.js").play(msg, {url: r.link, title: r.title, requester: msg.author.username, duration: timestamp, id: r.id});
                });
                msg.channel.send("<:mplay:488399581470785557> Odtwarzanie: `" + r.title + "` z kanału `" + r.channelTitle + "`");
            }
            ok = true;
        });
    });
}

module.exports.getTimestamp = async (id, callback) => getTimestamp(id, callback);

function getTimestamp(id, callback) {
    youtube.videos.list({id:id, part:"contentDetails", key: config.ytapikey}, (err, data) => {
        if(err) {console.log(err); msg.reply(err); return;}
        
        data.items.forEach(vid => {
            var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
            var hours = 0, minutes = 0, seconds = 0;

            if (reptms.test(vid.contentDetails.duration)) {
                var matches = reptms.exec(vid.contentDetails.duration);
                if (matches[1]) hours = Number(matches[1]);
                if (matches[2]) minutes = Number(matches[2]);
                if (matches[3]) seconds = Number(matches[3]);
            }
            var uh = false;
            if (!hours == 0) {uh = true; if(hours <= 9) {hours = "0" + hours;}}
            if (minutes <= 9) minutes = "0" + minutes;
            if (seconds <= 9) seconds = "0" + seconds;
            var time = "";
            if(uh) {time = `${hours}:${minutes}:${seconds}`;} else {time = `${minutes}:${seconds}`;}
            if(time == "00:00") {callback("LIVE"); return;}
            callback(time);
        });
    });
}