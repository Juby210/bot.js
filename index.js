const Discord = require('discord.js');
const client = new Discord.Client();
const yt = require('ytdl-core');
var youtubeSearch = require('youtube-search');
var youtube = require("youtube-api");
var fs = require("fs");
let voiceban = require("./voiceban.json");
const config = require("./config.json");
const prefix = config.prefix;
var inviteurl = "https://discordapp.com/oauth2/authorize?&client_id=479612191767789573&scope=bot&permissions=8";
var lock = false;

let queue = {};

client.on('ready', () => {
    console.log(`${client.user.tag} działa no`);
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
    if (!voiceban.hasOwnProperty(g.id)) voiceban[g.id] = {}, voiceban[g.id].banned = [];
    ustaw_status();
});

function ustaw_status() {
    if (client.guilds.size == 1) {
        client.user.setActivity(`testowanie na 1 serwerze | Prefix: ${prefix}`, { type: 'WATCHING' });
    } else {
        client.user.setActivity(`testowanie na ${client.guilds.size} serwerach | ${client.users.size - 1} użytkowników | Prefix: ${prefix}`, { type: 'WATCHING' });
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

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var text = args.slice(0).join(" ");
    var text2 = args.slice(1).join(" ");

    if(command == "help") {
        var embed = new Discord.RichEmbed;
        embed.setAuthor(`${client.user.username} - Prefix: ${prefix}`, client.user.avatarURL);
        embed.setColor("#0099FF");
        embed.setTitle(`${prefix}help`);
        embed.setDescription("Lista komend bota: \n`user, ban, kick, resetall, renameall, rename, voicekick, voiceban, voiceunban, uptime, github, invite, botinfo`");
        embed.addField("FUNKCJE BETA: \nBot muzyczny:", "`play, search, q, clearqueue, leave, join`");
        embed.addField("Komendy działające tylko jak bot gra:", "`pause, resume, skip, vol, np`");
        embed.addBlankField();
        embed.addField("Po więcej info o komendach wpisz:", `${prefix}info <komenda>`);
        message.channel.send(embed);
    }
    if(command == "info") {
        var embed = new Discord.RichEmbed();
        embed.setColor("#0088FF");
        embed.setAuthor(`${client.user.username} - Komenda info, czyli informacje o komendach`, client.user.avatarURL);
        switch (args[0]) {
            case "user":
                embed.addField(`${prefix}user [wzmianka/nazwa]`, "Wyświetla informacje o użytkowniku");
                break;
            case "ban":
                embed.addField(`${prefix}ban <wzmianka>`, `Banuje wzmienioną osobę`);
                embed.setFooter("Wymagane uprawnienia: Banowanie członków");
                break;
            case "kick":
                embed.addField(`${prefix}kick <wzmianka>`, `Kickuje wzmienioną osobę`);
                embed.setFooter("Wymagane uprawnienia: Wyrzucanie członków");
                break;
            case "resetall":
                embed.addField(`${prefix}resetall`, `Resetuje wszystkim pseudonimy`);
                embed.setFooter("Wymagane uprawnienia: Zarządzanie pseudonimami");
                break;
            case "renameall":
                embed.addField(`${prefix}renameall <pseudonim>`, `Zmienia wszystkim pseudonimy na wpisany przez ciebie`);
                embed.setFooter("Wymagane uprawnienia: Zarządzanie pseudonimami");
                break;
            case "rename":
                embed.addField(`${prefix}rename <wzmianka/nazwa> <pseudnim>`, `Zmienia pseudonim`);
                embed.setFooter("Wymagane uprawnienia: Zarządzanie pseudonimami");
                break;
            case "voicekick":
                embed.addField(`${prefix}voicekick <wzmianka/osoba>`, `Kickuje z kanału głosowego wybraną osobę`);
                embed.setFooter("Wymagane uprawnienia: Przenieś członków");
                break;
            case "voiceban":
                embed.addField(`${prefix}voiceban <wzmianka/osoba>`, `Blokuje możliwość wejścia na kanały głosowe wskazanej osobie na zawsze`);
                embed.setFooter("Wymagane uprawnienia: Przenieś członków");
                break;
            case "voiceunban":
                embed.addField(`${prefix}voiceunban <wzmianka>`, `Odblokuje możliwość wejścia na kanały głosowe osobie która dostała bana`);
                embed.setFooter("Wymagane uprawnienia: Przenieś członków");
                break;
            case "uptime":
                embed.addField(`${prefix}uptime`, "Pokazuje ile bot jest aktywny od ostatniego restartu");
                break;
            case "github":
                embed.addField(`${prefix}github`, "Link do kodu bota na githubie");
                break;
            case "invite":
                embed.addField(`${prefix}invite`, "Link do zaproszenia bota");
                break;
            case "botinfo":
                embed.addField(`${prefix}botinfo`, "Informacje o użyciu zasobów przez bota oraz liczba serwerów/kanałów/użytkowników");
                break;
            case "play":
                embed.addField(`${prefix}play <link/wyszukiwanie>`, "Odtwarza/Dodaje do kolejki podany link/wyszukanie");
                embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
                break;
            case "search":
                embed.addField(`${prefix}search <wyszukiwanie>`, "Wyszukuje podaną frazę oraz wyświetla wybór 10 wyników");
                break;
            case "q":
                embed.addField(`${prefix}q`, "Pokazuje kolejkę dla serwera");
                break;
            case "clearqueue":
                embed.addField(`${prefix}clearqueue`, "Czyści kolejkę dla serwera");
                break;
            case "leave":
                embed.addField(`${prefix}leave`, "Bot wychodzi z kanału głosowego");
                break;
            case "join":
                embed.addField(`${prefix}join`, "Bot dołącza na twój kanał głosowy");
                break;
            case "pause":
                embed.addField(`${prefix}pause`, "Zatrzymuje odtwarzacz");
                embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
                break;
            case "resume":
                embed.addField(`${prefix}resume`, "Wznawia odtwarzacz");
                embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
                break;
            case "skip":
                embed.addField(`${prefix}skip`, "Pomija utwór");
                embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
                break;
            case "vol":
                embed.addField(`${prefix}vol <głośność>`, "Zmienia głośność");
                embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
                break;
            case "np":
                embed.addField(`${prefix}np`, "Pokazuje co aktualnie jest odtwarzane");
                embed.setFooter("Ta komenda działa tylko jeśli bot gra!");
                break;
            case "info":
                embed.setDescription("Naprawdę chcesz wyświetlić info o komendzie info? Eh.. no dobra");
                embed.addField(`${prefix}info <komenda>`, "Pokazuje informacje o komendzie, którą wpiszesz.");
                break;
            default:
                embed.setTitle("Nie znam takiej komendy, polecam sprawdzić `" + prefix + "help`");
        }
        if(args[0] == null) embed.setTitle("Może byś dał jakąś komendę bo chyba nie chcesz info o komendzie info?");
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
                        .catch(err => anticrash(message.channel, err));
                    });
                }
            } else {
                client.user.setAvatar(args[0])
                .then(user => message.react("✅"))
                .catch(err => anticrash(message.channel, err));
            }
        }
    }

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
    if(command == "off") {
        if(message.author.id == config.ownerid) {
            message.delete();
            message.channel.send("*Zamykanie w ciągu 30 sek*").then(mes => {
                client.user.setActivity("Zamykanie w ciągu 30 sek!");
                setTimeout(() => {
                    mes.edit("*Zamykanie w ciągu 20 sek*");
                    client.user.setActivity("Zamykanie w ciągu 20 sek!");
                    setTimeout(() => {
                        mes.edit("*Zamykanie w ciągu 10 sek*");
                        client.user.setActivity("Zamykanie w ciągu 10 sek!");
                        setTimeout(() => {
                            mes.edit("*Zamykanie w ciągu 5 sek*");
                            client.user.setActivity("Zamykanie!");
                            var c = 5;
                            var eh = setInterval(() => {
                                c -= 1
                                if(c == 0) {
                                    client.user.setStatus('invisible');
                                    clearInterval(eh);
                                    setTimeout(() => {
                                        client.destroy();
                                        setTimeout(() => {
                                            process.exit(1);
                                        }, 100)
                                    }, 100);
                                } else if (c == 1) {mes.delete(); message.channel.send("Zamykanie...");} else {
                                    mes.edit(`*Zamykanie w ciągu ${c} sek*`);
                                }
                            }, 1000);
                        }, 5000);
                    }, 10000);
                }, 10000);
            });
        }
    }
    if(command == "forceoff") {
        if(message.author.id != config.ownerid) return;
        message.channel.send("Zamykanie...");
        client.user.setStatus('invisible');
        setTimeout(() => {
            client.destroy();
            setTimeout(() => {
                process.exit(1);
            }, 100)
        }, 100);
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
        if(!message.member.hasPermission("MANAGE_NICKNAMES")) {message.reply("Brak uprawnień!"); message.react("❌"); return;}
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
});

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

function anticrash(chan, err) {
    console.log("AntiCrash:");
    console.log(err);
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${client.user.username} - AntiCrash`);
    embed.setDescription(err);
    embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
    embed.setColor("#FF0000");
    if(chan != null) chan.send(embed);
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