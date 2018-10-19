const Discord = require("discord.js");
var usage = require('pidusage');
const db = require("../../util/db.js");
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);
    switch(args[0]) {
        case "invite":
            var embed = new Discord.RichEmbed();
            embed.setColor("#00ff00");
            embed.setTitle("Link do zaproszenia bota:");
            embed.setDescription(`https://discordapp.com/oauth2/authorize?&client_id=${client.user.id}&scope=bot&permissions=8`);
            embed.setFooter(`${client.user.username} - Autor: Juby210#5831 & hamster#0001`, client.user.avatarURL);
            message.channel.send(embed);
            break;
        case "info":
            var embed = new Discord.RichEmbed();
            embed.setColor("#00ff00");
            embed.setTitle("Bot Info:");
            embed.addField("Ping", Math.floor(client.ping), true);
            usage(process.pid, (err, res) => {
                if(err) {anticrash(message.channel, err); return;}
                var ram = Math.floor(res.memory / 1024 / 1024);
                embed.addField("RAM: (MB)", ram, true);
                embed.addField("CPU:", Math.floor(res.cpu) + "%", true);
                embed.addField("Użytkownicy:", client.users.size - 1, true);
                embed.addField("Kanały:", client.channels.size, true);
                embed.addField("Serwery:", client.guilds.size, true);
                util.getUsername("324622488644616195").then(juby => {
                    util.getUsername("321665259842830336").then(hamster => {
                        embed.setFooter(`${client.user.username} - Autorzy: ${juby} & ${hamster}`, client.user.avatarURL);
                        message.channel.send(embed);
                    });
                });
            });
            break;
        case "uptime":
            var totalSec = client.uptime / 1000;
            var hours = Math.floor(totalSec / 3600);
            totalSec %= 3600;
            var mins = Math.floor(totalSec / 60);
            var secs = Math.floor(totalSec % 60);
            message.channel.send(`Jestem aktywny od: *${hours} godzin, ${mins} minut i ${secs} sekund*`);
            break;
        default:
            message.channel.send("Nieprawidłowy argument, sprawdź `" + prefix + "info bot`");
    }
}

module.exports.help = {
    name: "bot",
    name2: "bot <info/invite/uptime>",
    desc: "Komenda o bocie\nbot info: Informacje o użyciu zasobów przez bota oraz liczba serwerów/kanałów/użytkowników\nbot invite: Link do zaproszenia bota\nbot uptime: Pokazuje ile bot jest aktywny od ostatniego restartu"
}