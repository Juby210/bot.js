const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const yt = require('ytdl-core');
var youtubeSearch = require('youtube-search');
var youtube = require("youtube-api");
var fs = require("fs");
let voiceban = require("./voiceban.json");
const config = require("./config.json");
const prefix = config.prefix;
var inviteurl = "https://discordapp.com/oauth2/authorize?&client_id=479612191767789573&scope=bot&permissions=8";
var lock = false;
const DBL = require("dblapi.js");
const dbl = new DBL(config.dbl.token, client);
let reqV = config.dbl.requireVote;
const request = require('request');
let urls = require("./urls.json");
var clc = require("cli-colors");

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
      client.commands.set(props.help.name, props);
    });
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
  fs.readdir("./commands/dev/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Nie znaleziono komend");
      return;
    }
  
    jsfile.forEach((f, i) =>{
      let props = require(`./commands/dev/${f}`);
      console.log(`${f} zostalo zaladowane!`);
      client.commands.set(props.help.name, props);
    });
  });


let queue = {};

client.on('ready', () => {
    console.log(clc.cyan(`${client.user.tag} działa`));
    inviteurl = `https://discordapp.com/oauth2/authorize?&client_id=${client.user.id}&scope=bot&permissions=8`;
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
    if(command == "lockbot") {
        if(message.author.id != config.ownerid) return;
        message.delete();
        if(lock) {
            lock = false;
            client.user.setStatus(config.status);
        } else {
            lock = true;
            client.user.setStatus("invisible");
        }
    }
    if(command == "servers") {
        if(message.author.id != config.ownerid) return;
        let tosend = [];
        var i = 0;
        client.guilds.forEach(g => { i += 1; tosend.push({c: i, title: g.name, id: g.id, owner: g.owner.user.username});});
        const embed = new Discord.RichEmbed;
        embed.setTitle(`Serwery:`);
        tosend.forEach(e => {
            embed.addField(`${e.c}. ${e.title}`, `ID: ${e.id} | Właściciel: ${e.owner}`);
        });
		message.author.send(embed);
    }

    if (command == "voicekick") {
        if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
        if(args[0] == null) {message.channel.send("Podaj kogo chcesz wyrzucić"); return;}
        if(message.mentions.users.first() == null) {
            var zn2 = false;
            message.guild.members.forEach(function(memb) {
                if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                    message.guild.createChannel("Kick", "voice").then(vChan => {
                        memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                        message.react("✅");
                    }).catch(err => anticrash(message.channel, err));
                    zn2 = true;
                }
            });
            if (zn2 == false) {
                message.reply("nie znaleziono takiego użytkownika!");
                return;
            }
        } else {
            var memb = message.guild.member(message.mentions.users.first());
            message.guild.createChannel("Kick", "voice").then(vChan => {
                memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                message.react("✅");
            }).catch(err => anticrash(message.channel, err));
            zn2 = true;
        }
    }
    if(command == "voiceban") {
        if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
        if(args[0] == null) {message.channel.send("Podaj kogo chcesz zbanować"); return;}
        if(message.mentions.users.first() == null) {
            var zn2 = false;
            message.guild.members.forEach(function(memb) {
                if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                    if(memb.user.id == client.user.id) {message.reply("mnie się nie banuje!"); return;}
                    voiceban[message.guild.id].banned.push({id: memb.user.id});
                    message.guild.createChannel("Kick", "voice").then(vChan => {
                        memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                    }).catch(err => anticrash(message.channel, err));
                    message.react("✅");
                    fs.writeFile("voiceban.json", JSON.stringify(voiceban), function(err) {
                        if (err) anticrash(message.channel, err);
                    });
                    zn2 = true;
                }
            });
            if (zn2 == false) {
                message.reply("nie znaleziono takiego użytkownika!");
                return;
            }
        } else {
            var memb = message.guild.member(message.mentions.users.first());
            if(memb.user.id == client.user.id) {message.reply("mnie się nie banuje!"); return;}
            voiceban[message.guild.id].banned.push({id: memb.user.id});
            message.guild.createChannel("Kick", "voice").then(vChan => {
                memb.setVoiceChannel(vChan).then(mem => vChan.delete());
            }).catch(err => anticrash(message.channel, err));
            message.react("✅");
            fs.writeFile("voiceban.json", JSON.stringify(voiceban), function(err) {
                if (err) anticrash(message.channel, err);
            });
            zn2 = true;
        }
    }
    if(command == "voiceunban") {
        if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
        if(message.mentions.users.first() == null) {message.reply("wzmiankuj kogo chcesz odbanować")} else {
            var zn = false;
            var memb = message.guild.member(message.mentions.users.first());
            voiceban[message.guild.id].banned.forEach(ban => {
                if(ban.id == memb.user.id) {
                    zn = true;
                    voiceban[message.guild.id].banned.splice(ban, 1);
                    message.channel.send(`<@${memb.user.id}> został odbanowany przez ${message.author.username}!`);
                    fs.writeFile("voiceban.json", JSON.stringify(voiceban), function(err) {
                        if (err) console.log(err);
                    });
                }
            });
            if(!zn) {
                message.channel.send("Ten użytkownik nie jest zbanowany!");
            }
        }
    }
    if(command == "uptime") {
        var totalSec = client.uptime / 1000;
        var hours = Math.floor(totalSec / 3600);
        totalSec %= 3600;
        var mins = Math.floor(totalSec / 60);
        var secs = Math.floor(totalSec % 60);
        message.channel.send(`Jestem aktywny od: *${hours} godzin, ${mins} minut i ${secs} sekund*`);
    }
    if(command == "github") {
        var embed = new Discord.RichEmbed();
        embed.setColor("#ffd700");
        embed.setTitle("Oto kod tego *świetnego bota*:");
        embed.setDescription("https://github.com/juby210-PL/bot.js");
        message.channel.send(embed);
    }
    if (command == "invite") {
        var embed = new Discord.RichEmbed();
        embed.setColor("#00ff00");
        embed.setTitle("Link do zaproszenia bota:");
        embed.setDescription(inviteurl);
        embed.setFooter(`${client.user.username} - Autor: Juby210#5831`, client.user.avatarURL);
        message.channel.send(embed);
    }
    if(command == "botinfo") {
        var usage = require('pidusage');
        var embed = new Discord.RichEmbed();
        embed.setColor("#00ff00");
        embed.setTitle("Bot Info:");
        embed.addField("Ping", client.ping, true);
        usage(process.pid, (err, res) => {
            if(err) {anticrash(message.channel, err); return;}
            var ram = Math.floor(res.memory / 1024 / 1024);
            embed.addField("RAM: (MB)", ram, true);
            embed.addField("CPU:", Math.floor(res.cpu) + "%", true);
            embed.addField("Użytkownicy:", client.users.size - 1, true);
            embed.addField("Kanały:", client.channels.size, true);
            embed.addField("Serwery:", client.guilds.size, true);
            embed.setFooter(`${client.user.username} - Autor: Juby210#5831`, client.user.avatarURL);
            message.channel.send(embed);
        });
    }
    if(command == "eval") {
        if(message.author.id != config.ownerid) return;
        var evalv = null;
        try {evalv = eval(text);} catch(err) {anticrash(message.channel, err, false); return;}
        var embed = new Discord.RichEmbed();
        embed.setColor("#0FF49A");
        embed.setAuthor("Eval Command");
        embed.setTitle("Input:");
        embed.setDescription("```js\n" + text + "\n```");
        try{evalv = evalv.replace(config.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.dbl.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.ytapikey, "RaCzEjNiErAcZeJnIeRaCzEjNiE");} catch(err) {}
        embed.addField("Output:", "```js\n" + evalv + "\n```");
        message.channel.send(embed);
    }
    if(command == "dbl") {
        if(args[1] == null) {message.channel.send(`Nieprawidłowa ilość argumentów. Sprawdź poprawne użycie: ${prefix}info ${command}`); return;}
        if(args[0] == "user") {
            if(message.mentions.users.first() == null) {
                message.channel.send("Wzmiankuj użytkownika którego chcesz sprawdzić");
            } else {
                dbl.getUser(message.mentions.users.first().id).then(user => {
                    var embed = new Discord.RichEmbed();
                    var color = "#283593";
                    var kolor = false;
                    if(user.color != undefined) {color = user.color; kolor = true;}
                    embed.setColor(color);
                    if(!kolor) color = "Nie ustawiono koloru.";
                    var bio = "Nie dodano bio.";
                    var gh = "Nie dodano profilu.";
                    var yt = "Nie dodano profilu.";
                    var rd = "Nie dodano profilu.";
                    var tw = "Nie dodano profilu.";
                    var ig = "Nie dodano profilu.";
                    if(user.bio != undefined) bio = user.bio;
                    if(user.social) {
                        try {
                            if(user.social.github != "") gh = user.social.github;
                            if(user.social.youtube != "") yt = user.social.youtube;
                            if(user.social.reddit != "") rd = user.social.reddit;
                            if(user.social.twitter != "") tw = user.social.twitter;
                            if(user.social.instagram != "") ig = user.social.instagram;
                        } catch(err) {}
                    }
                    embed.setDescription(`Użytkownik: ${user.username}#${user.discriminator}\nID: ${user.id}\nAdmin/Mod/Mod strony: ${user.admin}/${user.mod}/${user.webMod}\nBio: ${bio}\nKolor: ${color}\nGithub: ${gh}\nYoutube: ${yt}\nReddit: ${rd}\nTwitter: ${tw}\nInstagram: ${ig}`);
                    embed.setThumbnail(message.mentions.users.first().avatarURL);
                    message.channel.send(embed);
                }).catch(err => anticrash(message.channel, err, false));
            }
        } else if (args[0] == "bot") {
            if(message.mentions.users.first() == null) {
                message.channel.send("Wzmiankuj bota, którego chcesz wyszukać");                
            } else {
                dbl.getBot(message.mentions.users.first().id).then(fbot => {
                    var embed = new Discord.RichEmbed();
                    embed.setColor("#283593");
                    var desc = fbot.longdesc;
                    if(desc == "" || desc == undefined) desc = fbot.shortdesc;
                    var owners = "";
                    fbot.owners.forEach(oid => {
                        try{
                            if(owners == "") {owners = client.users.find("id", oid).tag;} else {
                                owners = owners + ", " + client.users.find("id", oid).tag;
                            }
                        } catch(err) {}
                    });
                    embed.setDescription(`Nazwa: ${fbot.username}#${fbot.discriminator}\nID: ${fbot.id}\nOpis:\n${desc}\n[Invite](${fbot.invite})\nStrona bota: ${fbot.website}\nKod: ${fbot.github}\nPrefix: ${fbot.prefix}\nBiblioteka: ${fbot.lib}\nTwórca: ${owners}\nTagi: ${fbot.tags + ""}\nGłosy: ${fbot.points}\n[Pokaż na discordbots.org](https://discordbots.org/bot/${fbot.id})`);
                    embed.setThumbnail(message.mentions.users.first().avatarURL);
                    message.channel.send(embed);
                }).catch(err => anticrash(message.channel, err, false));
            }
        }
    }
    if(command == "shorten") {
        if(!config.yourls.useyourls) {message.channel.send("Właściciel bota nie skonfigurował skracacza linków."); return;}
        if(args[0] == null) {message.channel.send(`Nieprawidłowa ilość argumentów. Sprawdź poprawne użycie: ${prefix}info ${command}`); return;}
        var cust = false;
        if(args[1] != null) cust = true;
        if(cust) {
            request({
                method: "POST",
                url: `${config.yourls.apiurl}?signature=${config.yourls.signature}&format=json&action=shorturl&url=${args[0]}&keyword=${args[1]}`
            }, (error, response, body) => {
                if (error) return;
                if (response.statusCode == 200) {
                    var result = JSON.parse(body);
                    message.channel.send("Oto twój krótki url: " + result.shorturl);
                    try{
                        urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                    } catch(e) {
                        urls[message.author.id] = {};
                        urls[message.author.id].urls = [];
                        urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                    }
                    fs.writeFile("urls.json", JSON.stringify(urls), function(err) {
                        if (err) console.log(err);
                    });
                }
            });
        } else {
            request({
                method: "POST",
                url: `${config.yourls.apiurl}?signature=${config.yourls.signature}&format=json&action=shorturl&url=${args[0]}`
            }, (error, response, body) => {
                if (error) return;
                if (response.statusCode == 200) {
                    var result = JSON.parse(body);
                    message.channel.send("Oto twój krótki url: " + result.shorturl);
                    try{
                        urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                    } catch(e) {
                        urls[message.author.id] = {};
                        urls[message.author.id].urls = [];
                        urls[message.author.id].urls.push({short: result.shorturl, full: args[0]});
                    }
                    fs.writeFile("urls.json", JSON.stringify(urls), function(err) {
                        if (err) console.log(err);
                    });
                }
            });
        }
    }
    if(command == "urls") {
        if(!config.yourls.useyourls) {message.channel.send("Właściciel bota nie skonfigurował skracacza linków."); return;}
        if(!urls.hasOwnProperty(message.author.id)) {message.channel.send("Nie masz swoich krótkich linków"); return;}
        var embed = new Discord.RichEmbed();
        embed.setTitle("Twoje krótkie linki: ");
        var tosend = [];
        urls[message.author.id].urls.forEach((url, i) => {tosend.push({c: i+1, short: url.short, full: url.full});});
        tosend.forEach(e => {
            embed.addField(`${e.c}. ${e.short}`, `Pełny link: ${e.full}`);
        });
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
                var col = mes.createReactionCollector((rea, user) => user.bot == false);
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