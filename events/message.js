const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
var queuefile = require('../commands/music/f/queue.js');
let voiceban = require("../voiceban.json");
const config = require("../config.json");
const index = require("../index.js");
const prefix = config.prefix;
var lock = false;
const DBL = require("dblapi.js");
const dbl = new DBL(config.dbl.token, client);

module.exports = (message) => {
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
    let cmod = messageArray[0];
    let commandfile = client.commands.get(cmod.slice(prefix.length));

    if(config.dbl.usedbl) {
        if (!reqV.hasOwnProperty(command)) {if(commandfile) commandfile.run(client,message,args);} else {
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
                    }
                }).catch(err => index.anticrash(message.channel, err));
            } else {
                if(commandfile) commandfile.run(client,message,args);
            }
        }
    } else {
        if(commandfile) commandfile.run(client,message,args);
    }
}