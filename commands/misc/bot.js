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
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(guildID);

    switch(args[0]) {
        case "invite":
            var embed = new Discord.RichEmbed();
            embed.setColor("#00ff00");
            embed.setTitle(`${strings.getMsg("botinvite")}:`);
            embed.setDescription(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
            util.getUsername("324622488644616195").then(juby => {
                util.getUsername("321665259842830336").then(hamster => {
                    embed.setFooter(`${client.user.username} - ${strings.getMsg("authors")}: ${juby} & ${hamster}`, client.user.avatarURL);
                    message.channel.send(embed);
                });
            });
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
                embed.addField(`${strings.getMsg("users")}:`, client.users.size - 1, true);
                embed.addField(`${strings.getMsg("channels")}:`, client.channels.size, true);
                embed.addField(`${strings.getMsg("servers")}:`, client.guilds.size, true);
                util.getUsername("324622488644616195").then(juby => {
                    util.getUsername("321665259842830336").then(hamster => {
                        embed.setFooter(`${client.user.username} - ${strings.getMsg("authors")}: ${juby} & ${hamster}`, client.user.avatarURL);
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
            message.channel.send(`${strings.getMsg("uptime")}: **${hours} h ${mins} m ${secs} s**`);
            break;
        default:
            message.channel.send(`${strings.getMsg("invalidarg")}, ${strings.getMsg("check")} \`${prefix}info bot\``);
    }
}

module.exports.help = {
    name: "bot",
    name2: "bot <info/invite/uptime>",
    desc: "Komenda o bocie\nbot info: Informacje o użyciu zasobów przez bota oraz liczba serwerów/kanałów/użytkowników\nbot invite: Link do zaproszenia bota\nbot uptime: Pokazuje ile bot jest aktywny od ostatniego restartu"
}