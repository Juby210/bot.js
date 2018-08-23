const Discord = require('discord.js');
const client = new Discord.Client();
const yt = require('ytdl-core');
var youtubeSearch = require('youtube-search');
var youtube = require("youtube-api");
var fs = require("fs");
let voiceban = require("./voiceban.json");
const config = require("./config.json");
const prefix = config.prefix;

let queue = {};

client.on('ready', () => {
    console.log(`${client.user.tag} działa no`);
    client.user.setStatus(config.status);
    ustaw_status();
    client.guilds.forEach(g => {
        if (!queue.hasOwnProperty(g.id)) queue[g.id] = {}, queue[g.id].playing = false, queue[g.id].songs = [];
        if (!voiceban.hasOwnProperty(g.id)) voiceban[g.id] = {}, voiceban[g.id].banned = [];
    });
});

client.on('guildCreate', guild => {
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [];
    if (!voiceban.hasOwnProperty(g.id)) voiceban[g.id] = {}, voiceban[g.id].banned = [];
    ustaw_status();
});

function ustaw_status() {
    if (client.guilds.size == 1) {
        client.user.setActivity(`testowanie na 1 serwerze`, { type: 'WATCHING' });
    } else {
        client.user.setActivity(`testowanie na ${client.guilds.size} serwerach`, { type: 'WATCHING' });
    }
}

client.on("voiceStateUpdate", (oldMem, newMem) => {
    var vChannel = newMem.voiceChannel;
    if(vChannel == null) return;
    var zn = false;
    voiceban[newMem.guild.id].banned.forEach(ban => {
        if(ban.id == newMem.user.id) zn = true;
    });
    if(!zn) return;
    newMem.guild.createChannel("Kick", "voice").then(vChan => {
        newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
    }).catch(err => console.log(err));
});

client.on("message", message => {
    if(message.author.bot) return;
    if (message.mentions.users.first() == null) {} else {
        if (message.content != message.mentions.users.first()) {} else {
            if (message.mentions.users.first().id == client.user.id) {message.reply("mój prefix to `" + prefix + "`!");}
        }
    }
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var text = args.slice(0).join(" ");
    var text2 = args.slice(1).join(" ");

    if(command == "help") {
        var embed = new Discord.RichEmbed;
        embed.setAuthor(`${client.user.username} - Prefix: ${prefix}`, client.user.avatarURL);
        embed.setColor("#0099FF");
        embed.setTitle(`${prefix}help`);
        embed.setDescription("Lista komend bota");
        embed.addField(`${prefix}user [wzmianka/nazwa]`, `Informacje o użytkowniku`);
        embed.addField(`${prefix}ban <wzmianka>`, `Banuje wzmienioną osobę`);
        embed.addField(`${prefix}kick <wzmianka>`, `Kickuje wzmienioną osobę`);
        embed.addField(`${prefix}resetall`, `Resetuje wszystkim pseudonimy`);
        embed.addField(`${prefix}renameall <pseudonim>`, `Zmienia wszystkim pseudonimy na wpisany przez ciebie`);
        embed.addField(`${prefix}rename <wzmianka/nazwa> <pseudnim>`, `Zmienia pseudonim`);
        embed.addField(`${prefix}voicekick <wzmianka/osoba>`, `Kickuje z kanału głosowego wybraną osobę`);
        embed.addField(`${prefix}voiceban <wzmianka/osoba>`, `Blokuje możliwość wejścia na kanały głosowe wskazanej osobie na zawsze`);
        embed.addField(`${prefix}voiceunban <wzmianka>`, `Odblokuje możliwość wejścia na kanały głosowe osobie która dostała bana`);
        embed.addBlankField();
        embed.addField("FUNKCJE BETA:", "Bot muzyczny:");
        embed.addField(`${prefix}play <link/wyszukiwanie>`, "Odtwarza/Dodaje do kolejki podany link/wyszukanie");
        embed.addField(`${prefix}search <wyszukiwanie>`, "Wyszukuje podaną frazę oraz wyświetla wybór 10 wyników");
        embed.addField(`${prefix}q`, "Pokazuje kolejkę dla serwera");
        embed.addField(`${prefix}leave`, "Bot wychodzi z kanału głosowego");
        embed.addField(`.`, "Komendy działające tylko gdy bot odtwarza:");
        embed.addField(`${prefix}pause`, "Zatrzymuje odtwarzacz");
        embed.addField(`${prefix}resume`, "Wznawia odtwarzacz");
        embed.addField(`${prefix}skip`, "Pomija utwór");
        embed.addField(`${prefix}vol <głośność>`, "Zmienia głośność");
        embed.addField(`${prefix}np`, "Pokazuje co aktualnie jest odtwarzane");
        message.channel.send(embed);
    }

    if (command == "user") {
        var gra = "Użytkownik w nic nie gra."
        var stream = false;
        var member = null;
        var member2 = null;
        if(args[0] == null) {
            member = message.author;
            member2 = message.member;
        } else {
            if(message.mentions.users.first() == null) {
                var zn2 = false;
                message.guild.members.forEach(function(memb) {
                    if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                        member = memb.user;
                        member2 = memb;
                        zn2 = true;
                    }
                });
                if (zn2 == false) {
                    message.reply("nie znaleziono takiego użytkownika!");
                    return;
                }
            } else {
                member = message.guild.members.find('id', message.mentions.users.first().id).user;
                member2 = message.guild.members.find('id', message.mentions.users.first().id);
            }
        }
        try{
            var gra = member.presence.game.name;
            stream = member.presence.game.streaming;
        } catch(err) {}
        var role = "";
        member2.roles.forEach(r => {
            if (role == "") {
                role += r.name;
            } else {
                role += ", " + r.name;
            }
        });
        var pseudo = member2.nickname;
        if(pseudo == null) {pseudo = member.username;}
        message.channel.send({embed: {
            color: 0xf1c40f,
            author: {
                name: member.tag,
                icon_url: member.avatarURL
            },
            fields: [{
                name: "Nick:",
                value: member.username,
                inline: true
            }, {
                name: "Tag:",
                value: member.discriminator,
                inline: true
            }, {
                name: "Pseudonim:",
                value: pseudo,
                inline: true
            }, {
                name: "Gra:",
                value: gra
            }, {
                name:"Stream:",
                value: stream,
                inline: true
            }, {
                name:"ID:",
                value: member.id,
                inline: true
            }, {
                name:"Status:",
                value: member.presence.status,
                inline: true
            }, {
                name: "Konto stworzone:",
                value: member.createdAt,
                inline: true
            }, {
                name: "Dołączono na serwer:",
                value: member2.joinedAt,
                inline: true
            }, {
                name:"Role [" + member2.roles.size + "]:",
                value: role,
                inline: true
            }],
            thumbnail: {
                url: member.avatarURL
            }
        }});
    }

    if(command == "status") {
        switch (args[0]) {
            case "online":
                client.user.setStatus("online");
                message.channel.send("Status ustawiony na Online!");
                break;
            case "idle":
                client.user.setStatus("idle");
                message.channel.send("Status ustawiony na Zaraz Wracam (idle)!");
                break;
            case "dnd":
                client.user.setStatus("dnd");
                message.channel.send("Status ustawiony na Nie przeszkadzać (dnd)!");
                break;
            case "invisible":
                client.user.setStatus("invisible");
                message.channel.send("Status ustawiony na Niewidzialny!");
                break;
            default:
                message.channel.send("`online | idle | dnd | invisible`");
        }
    }

    if(command == "ban") {
        if(message.member.hasPermission("BAN_MEMBERS") == true) {
            if(args[0] == null) {
                message.reply("Podaj użytkownika do zbanowania!");
                message.react("❌");
            } else {
                var member = message.guild.members.find('id', message.mentions.users.first().id);
                if(member.bannable == true) {
                    member.ban("Zbanowano przez użytkownika: " + message.author.tag);
                    message.channel.send("Zbanowano użytkownika: " + member.user.username);
                    message.react("✅");
                } else {
                    message.channel.send("Bot nie ma uprawnień do zbanowania tego użytkownika!");
                    message.react("❌");
                }
            }
        } else {
            message.reply("Brak uprawnień!");
            message.react("❌");
        }
    }
        
    if(command == "kick") {
        if(message.member.hasPermission("KICK_MEMBERS") == true) {
            if(args[0] == null) {
                message.reply("Podaj użytkownika do wyrzucenia!");
                message.react("❌");
            } else {
                    var member = message.guild.members.find('id', message.mentions.users.first().id);
                    if (member.kickable == true) {
                        member.kick("Wyrzucono przez użytkownika: " + message.author.tag);
                        message.channel.send("Wyrzucono użytkownika: " + member.user.username);
                        message.react("✅");
                    } else {
                        message.channel.send("Bot nie ma uprawnień do wyrzucenia tego użytkownika!");
                        message.react("❌");
                    }
                }
            } else {
                message.reply("Brak uprawnień!");
                message.react("❌");
            }
        }

    if(command == "nick") {
        if(message.author.id == config.ownerid) {
            client.user.setUsername(text).then(message.react("✅"));
        } else {
            message.react("❌");
        }
    }

    if(command == "avatar") {
        if(message.author.id == config.ownerid) {
            if(args[0] == null) {
                if(Array.from(message.attachments)[0] == null) {
                    message.reply("Podaj link do avatara!");
                    message.react("❌");
                } else {
                    message.attachments.forEach(function(a) {
                        client.user.setAvatar(a.url)
                        .then(user => message.react("✅"))
                        .catch(console.error);
                    });
                }
            } else {
                client.user.setAvatar(args[0])
                .then(user => message.react("✅"))
                .catch(console.error);
            }
        }
    }

    if(command == "off") {
        if(message.author.id == config.ownerid) {
            message.channel.send("Zamykanie...");
            client.user.setStatus('invisible');
            client.destroy();
            setTimeout(() => {
                process.exit(1);
            }, 100);
        }
    }

    if(command == "resetall") {
        if(message.member.hasPermission("MANAGE_NICKNAMES") == true) {
            if(message.guild.member(client.user).hasPermission("MANAGE_NICKNAMES") == true) {
                message.reply("rozpoczęto resetowanie!");
                message.guild.members.forEach(mem => {
                mem.setNickname("");
                });
                message.react("✅");
            } else {
                message.channel.send("Bot nie ma uprawnień do zarządzania pseudonimami");
                message.react("❌");
            }
        } else {
            message.reply("Brak uprawnień!");
            message.react("❌");
        }
    }

    if(command == "renameall") {
        if(message.member.hasPermission("MANAGE_NICKNAMES") == true) {
            if(message.guild.member(client.user).hasPermission("MANAGE_NICKNAMES") == true) {
                message.reply("rozpoczęto zmienianie!");
                message.guild.members.forEach(mem => {
                    mem.setNickname(text);
                });
                message.react("✅");
            } else {
                message.channel.send("Bot nie ma uprawnień do zarządzania pseudonimami");
                message.react("❌");
            }
        } else {
            message.reply("Brak uprawnień!");
            message.react("❌");
        }
    }

    if(command == "rename") {
        if(message.mentions.users.first() == null) {
            var zn2 = false;
            message.guild.members.forEach(function(memb) {
                if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                    memb.setNickname(text2);
                    message.react("✅");
                    zn2 = true;
                }
            });
            if (zn2 == false) {
                message.reply("nie znaleziono takiego użytkownika!");
                return;
            }
        } else {
            message.guild.members.find('id', message.mentions.users.first().id).setNickname(text2);
            message.react("✅");
        }
    }
    if (command == "voicekick") {
        if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
        if(message.mentions.users.first() == null) {
            var zn2 = false;
            message.guild.members.forEach(function(memb) {
                if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                    message.guild.createChannel("Kick", "voice").then(vChan => {
                        memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                        message.react("✅");
                    }).catch(err => console.log(err));
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
            }).catch(err => console.log(err));
            zn2 = true;
        }
    }
    if(command == "voiceban") {
        if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
        if(message.mentions.users.first() == null) {
            var zn2 = false;
            message.guild.members.forEach(function(memb) {
                if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                    if(memb.user.id == client.user.id) {message.reply("mnie się nie banuje!"); return;}
                    voiceban[message.guild.id].banned.push({id: memb.user.id});
                    message.guild.createChannel("Kick", "voice").then(vChan => {
                        memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                    }).catch(err => console.log(err));
                    message.react("✅");
                    fs.writeFile("voiceban.json", JSON.stringify(voiceban), function(err) {
                        if (err) console.log(err);
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
            }).catch(err => console.log(err));
            message.react("✅");
            fs.writeFile("voiceban.json", JSON.stringify(voiceban), function(err) {
                if (err) console.log(err);
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
    if(command == "play") {
        var vChannel = message.member.voiceChannel;
        if(vChannel == null) {
            message.reply("najpierw wejdź na kanał głosowy!");
            return;
        } else {
            if (message.guild.member(client.user).voiceChannel != vChannel) {
                vChannel.join().catch(err => console.log(err));
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
                if(Number(m.content) == NaN) {m.reply("nieprawidłowa liczba!"); return;}
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
                                vChannel.join().catch(err => console.log(err));
                            }
                        }
                        zn = true;
                        collector.stop();
                        if (queue[m.guild.id].playing) {
                            getTimestamp(r.id, timestamp => {
                                queue[m.guild.id].songs.push({url: args[0], title: r.title, requester: message.author.username, duration: timestamp, id: r.id});
                            });
                            m.channel.send("Dodano do kolejki: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                        } else {
                            m.channel.send("Odtwarzanie: `" + r.title + "` z kanału `" + r.channelTitle + "`");
                            getTimestamp(r.id, timestamp => {
                                play_song(m, {url: args[0], title: r.title, requester: message.author.username, duration: timestamp, id: r.id});
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
});

function play_song(msg, song) {
    let dispatcher;
    queue[msg.guild.id].playing = true;
    try {
        dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), {passes: 1, bitrate: 256000});
    } catch(err) {try{dispatcher.end()} catch(err) {} queue[msg.guild.id].playing = false; return;}

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
            embed.setThumbnail(`https://i.ytimg.com/vi/${song.id}/maxresdefault.jpg`);
            embed.setFooter("Dodano przez: " + song.requester);
            m.channel.send(embed);
        }
    });

	dispatcher.on('error', (err) => {
        queue[msg.guild.id].playing = false;
        msg.channel.send('error: ' + err);
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

client.login(config.token);