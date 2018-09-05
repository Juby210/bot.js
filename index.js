const Discord = require('discord.js');
const client = new Discord.Client({
    clientOptions: {
        fetchAllMembers: true,
    }
});
client.commands = new Discord.Collection();
const yt = require('ytdl-core');
var youtubeSearch = require('youtube-search');
var youtube = require("youtube-api");
var fs = require("fs");
let voiceban = require("./voiceban.json");
const config = require("./config.json");
const prefix = config.prefix;
var lock = false;
const DBL = require("dblapi.js");
const dbl = new DBL(config.dbl.token, client);
let reqV = config.dbl.requireVote;
const request = require('request');
let urls = require("./urls.json");
var clc = require("cli-colors");
var commands = [];

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log(clc.red("Nie znaleziono komend w /commands/"));
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(clc.green(`${f} zostalo zaladowane!`));
      commands.push({name:props.help.name, category:props.help.category});
      client.commands.set(props.help.name, props);
      client.commands.set(props.help.aliases, props);
    });
    process.env["commands"] = commands;
  });
fs.readdir("./commands/dev/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log(clc.red("Nie znaleziono komend w /commands/dev/"));
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/dev/${f}`);
      console.log(clc.green(`${f} zostalo zaladowane!`));
      client.commands.set(props.help.name, props);
    });
});

let queue = {};

client.on('ready', () => {
    console.log(clc.cyan(`${client.user.tag} działa`));
    client.user.setStatus(config.status);
    ustaw_status();
    client.guilds.forEach(g => {
        if (!queue.hasOwnProperty(g.id)) queue[g.id] = {}, queue[g.id].playing = false, queue[g.id].songs = [];
        if (!voiceban.hasOwnProperty(g.id)) voiceban[g.id] = {}, voiceban[g.id].banned = [];
    });
});

client.on('guildCreate', guild => {
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [];
    if (!voiceban.hasOwnProperty(guild.id)) voiceban[guild.id] = {}, voiceban[guild.id].banned = [];
    ustaw_status();
});

client.on('guildDelete', guild => {
    ustaw_status();
});

function ustaw_status() {
    if (client.guilds.size == 1) {
        client.user.setActivity(`testowanie na 1 serwerze | Prefix: ${prefix}`, { type: 'WATCHING' });
    } else {
        client.user.setActivity(`testowanie na ${client.guilds.size} serwerach | Prefix: ${prefix}`, { type: 'WATCHING' });
    }
}

client.on("voiceStateUpdate", (oldMem, newMem) => {
    var vChann = oldMem.voiceChannel;
    if (oldMem.guild.voiceConnection) {
        if (vChann == oldMem.guild.voiceConnection.channel) {
            if (vChann.members.size == 1) {
                setTimeout(() => {
                    if (oldMem.guild.voiceConnection.channel.members.size == 1) {
                        oldMem.guild.voiceConnection.channel.leave();
                    }
                }, 300000); //300000 ms = 5 min
            }
        }
    }
    if(lock) return;
    var vChannel = newMem.voiceChannel;
    if(vChannel == null) return;
    var zn = false;
    voiceban[newMem.guild.id].banned.forEach(ban => {
        if(ban.id == newMem.user.id) zn = true;
    });
    if(!zn) return;
    newMem.guild.createChannel("Kick", "voice").then(vChan => {
        newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
    }).catch(err => anticrash(null, err));
});

client.on("message", message => {
    if(message.author.bot) return;
    if(message.author.id != config.ownerid) {
        if(lock) return;
    }
    if (message.mentions.users.first() == null) {} else {
        if (message.content != message.mentions.users.first()) {} else {
            if (message.mentions.users.first().id == client.user.id) {message.reply("mój prefix to `" + prefix + "`!");}
        }
    }
    if (!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var text = args.slice(0).join(" ");
    var text2 = args.slice(1).join(" ");
    let cmod = messageArray[0];
    let commandfile = client.commands.get(cmod.slice(prefix.length));

    if(config.dbl.usedbl) {
        if (!reqV.hasOwnProperty(command)) {if(commandfile) commandfile.run(client,message,args); cmd(message, command, text, text2, args);} else {
            if(reqV[command] == true) {
                dbl.hasVoted(message.author.id).then(v => {
                    if(!v) {
                        var embed = new Discord.RichEmbed();
                        embed.setColor("#A61818");
                        embed.setTitle("Ta komenda jest niedostępna dla ciebie");
                        embed.setDescription(`Aby mieć dostęp do tej komendy zagłosuj na tego bota na [discordbots.org](https://discordbots.org/bot/${client.user.id}/vote)`);
                        embed.setFooter("Jeśli już zagłosowałeś poczekaj ok. 2 min");
                        message.channel.send(embed);
                        return;
                    } else {
                        if(commandfile) commandfile.run(client,message,args);
                        cmd(message, command, text, text2, args);
                    }
                }).catch(err => anticrash(message.channel, err));
            } else {
                if(commandfile) commandfile.run(client,message,args);
                cmd(message, command, text, text2, args);
            }
        }
    } else {
        if(commandfile) commandfile.run(client,message,args);
        cmd(message, command, text, text2, args);
    }
});

function cmd(message = new Discord.Message(), command, text, text2, args) {
    if(command == "eval") {
        if(message.author.id != config.ownerid && message.author.id != config.devid) return;
        var evalv = null;
        var text = args.slice(0).join(" ");
        try {evalv = eval(text);} catch(err) {anticrash(message.channel, err, false); return;}
        var embed = new Discord.RichEmbed();
        embed.setColor("#0FF49A");
        embed.setAuthor("EVAL - JS");
        embed.setTitle("KOMENDA:");
        embed.setDescription("```js\n" + text + "\n```");
        try{evalv = evalv.replace(config.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.dbl.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.ytapikey, "RaCzEjNiErAcZeJnIeRaCzEjNiE");} catch(err) {}
        embed.addField("ODPOWIEDŹ:", "```js\n" + evalv + "\n```");
        message.channel.send(embed);
    }

    // Music bot: //
    if(command == "leave") {
        queue[message.guild.id].playing = false;
        queue[message.guild.id].songs = [];
        var bot = message.guild.member(client.user);
        if (bot.voiceChannel == undefined) {
            message.reply("bot nie jest połączony z żadnym kanałem!");
            return;
        }
        bot.voiceChannel.leave();
        message.react("✅");
    }
    if(command == "join") {
        var vChannel = message.member.voiceChannel;
        if(vChannel == null) {
            message.reply("najpierw wejdź na kanał głosowy!");
            return;
        } else {
            if (message.guild.member(client.user).voiceChannel != vChannel) {
                vChannel.join().then(() => message.react("✅")).catch(err => anticrash(message.channel, err));
            }
        }
    }
    if(command == "play") {
        var vChannel = message.member.voiceChannel;
        if(vChannel == null) {
            message.reply("najpierw wejdź na kanał głosowy!");
            return;
        } else {
            if (message.guild.member(client.user).voiceChannel != vChannel) {
                vChannel.join().catch(err => anticrash(message.channel, err));
            }
        }
        if(args[0] == null) {message.reply("jakiś linczek by się przydał"); return;}
        yt.getInfo(args[0], (err, info) => {
            if(err) {search(text, message); return;}
            if (queue[message.guild.id].playing) {
                message.channel.send("Dodano do kolejki: `" + info.title + "` z kanału `" + info.author.name + "`");
                getTimestamp(info.video_id, timestamp => {
                    queue[message.guild.id].songs.push({url: args[0], title: info.title, requester: message.author.username, duration: timestamp, id: info.video_id});
                });
            } else {
                message.channel.send("Odtwarzanie: `" + info.title + "` z kanału `" + info.author.name + "`");
                getTimestamp(info.video_id, timestamp => {
                    play_song(message, {url: args[0], title: info.title, requester: message.author.username, duration: timestamp, id: info.video_id});
                });
            }
        });
    }
    if(command == "q") {
        let tosend = [];
        queue[message.guild.id].songs.forEach((song, i) => { tosend.push({c: i+1, title: song.title, requester: song.requester, duration: song.duration});});
        if(tosend == []) {
            message.channel.send("Kolejka tego serwera jest pusta!");
            return;
        }
        const embed = new Discord.RichEmbed;
        embed.setTitle(`Kolejka serwera ${message.guild.name}:`);
        tosend.forEach(e => {
            embed.addField(`${e.c}. ${e.title}`, `Długość: ${e.duration} | Dodano przez: ${e.requester}`);
        });
		message.channel.send(embed);
    }
    if(command == "clearqueue") {
        queue[message.guild.id].songs = [];
        message.react("✅");
    }
    if(command == "search") {
        if(args[0] == null) {message.reply("nie mam co wyszukać"); return;}
        var opts = {
            maxResults: 15,
            key: config.ytapikey
        };
        youtubeSearch(text, opts, (err, results) => {
            if(err) {console.log(err); msg.reply(err); return;}
            
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
                        if (queue[m.guild.id].playing) {
                            getTimestamp(r.id, timestamp => {
                                queue[m.guild.id].songs.push({url: r.link, title: r.title, requester: message.author.username, duration: timestamp, id: r.id});
                            });
                            m.channel.send("Dodano do kolejki: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                        } else {
                            m.channel.send("Odtwarzanie: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                            getTimestamp(r.id, timestamp => {
                                play_song(m, {url: r.link, title: r.title, requester: message.author.username, duration: timestamp, id: r.id});
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
}

function play_song(msg, song) {
    let dispatcher;
    queue[msg.guild.id].playing = true;
    try {
        dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), {passes: 1, bitrate: 256000});
    } catch(err) {try{dispatcher.end()} catch(err) {} queue[msg.guild.id].playing = false; anticrash(msg.channel, err); return;}

    let collector = msg.channel.createMessageCollector(m => m);
	collector.on('collect', m => {
        const args = m.content.slice(prefix.length).trim().split(/ +/g);
        if(m.content.startsWith(`${prefix}pause`)) {
            dispatcher.pause();
            m.react("⏸");
        }
        if(m.content.startsWith(`${prefix}resume`)) {
            dispatcher.resume();
            m.react("▶");
        }
        if(m.content.startsWith(`${prefix}skip`)) {
            dispatcher.end();
            m.react("⏩");
        }
        if(m.content.startsWith(`${prefix}vol`)) {
            if(parseInt(args[1], 10) / 100 == NaN) {m.reply("nieprawidłowa liczba"); return;}
            dispatcher.setVolume(parseInt(args[1], 10) / 100);
            m.react("✅");
        }
        if(m.content.startsWith(`${prefix}np`)) {
            var embed = new Discord.RichEmbed;
            embed.setAuthor("Odtwarzanie: ", client.user.avatarURL);
            embed.setTitle(song.title);
            embed.setDescription("`" + `${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)} / ${song.duration}` + "`");
            embed.setThumbnail(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`);
            embed.setFooter("Dodano przez: " + song.requester);
            m.channel.send(embed).then(mes => {
                mes.react("⏸").then(() => mes.react("▶").then(() => mes.react("⏩")));
                var col = mes.createReactionCollector((rea, user) => user.id == m.author.id);
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
                            break;
                    }
                });
            });
        }
    });

	dispatcher.on('error', (err) => {
        queue[msg.guild.id].playing = false;
        var embed = new Discord.RichEmbed();
        embed.setAuthor(`${client.user.username} - AntiCrash`);
        embed.setDescription(err);
        embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
        embed.setColor("#FF0000");
        msg.channel.send(embed);
        collector.stop();
        return;
    });
    dispatcher.on('end', () => {
        collector.stop();
        var next = queue[msg.guild.id].songs.shift();
        if(next == null) {
            queue[msg.guild.id].playing = false;
        } else {
            play_song(msg, next);
        }
        return;
    });
}

function search(text, msg) {
    var opts = {
        maxResults: 2,
        key: config.ytapikey
    };
    var ok = false;
    youtubeSearch(text, opts, (err, results) => {
        if(err) {console.log(err); msg.reply(err); return;}
        
        if(results.length == 0) {msg.reply("nie znaleziono!"); return;}
        results.forEach(r => {
            if(ok) return;
            if(r.title == r.channelTitle) return;
            if (queue[msg.guild.id].playing) {
                msg.channel.send("Dodano do kolejki: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                getTimestamp(r.id, timestamp => {
                    queue[msg.guild.id].songs.push({url: r.link, title: r.title, requester: msg.author.username, duration: timestamp, id: r.id});
                });
            } else {
                getTimestamp(r.id, timestamp => {
                    play_song(msg, {url: r.link, title: r.title, requester: msg.author.username, duration: timestamp, id: r.id});
                });
                msg.channel.send("Odtwarzanie: `" + r.title + "` z kanału `" + r.channelTitle + "`");
            }
            ok = true;
        });
    });
}

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

module.exports.anticrash = async (chan, err, sendToOwner = true) => {
    anticrash(chan, err, sendToOwner);
}

function anticrash(chan, err, sendToOwner = true) {
    console.log("AntiCrash:");
    console.log(err);
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${client.user.username} - AntiCrash`);
    embed.setDescription(err);
    embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
    embed.setColor("#FF0000");
    if(chan != null) chan.send(embed);
    if(!sendToOwner) return;
    var owner = client.users.find("id", config.ownerid);
    if(owner == undefined) {return;}
    embed.addField(err.path, err.method);
    owner.send(embed);
}

client.on("error", err => {
    console.log("AntiCrash:");
    console.log(err);
    var owner = client.users.find("id", config.ownerid);
    if(owner == undefined) {return;}
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${client.user.username} - AntiCrash`);
    embed.setDescription(err);
    embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
    embed.addField(err.path, err.method);
    embed.setColor("#FF0000");
    owner.send(embed);
});

client.login(config.token);