const Discord = require('discord.js');
const config = require("../config.json");
const DBL = require("dblapi.js");
let reqV = config.dbl.requireVote;
const db = require('../util/db.js');
var logger = require("../util/logger.js");

module.exports = async (message, client) => {
    let guildID;
    if(!message.guild) {
        return;
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);

    const prefix = await db.getPrefix(guildID);
    if(message.author.bot) return;
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

    runcmd(command, commandfile, args, message, client, guildID);
    if(config.logs.enabled) if(commandfile) logger.log(commandfile.help.name, args, message);
}

function runcmd(command, commandfile, args, message, client, guildID) {
    const dbl = new DBL(config.tokens.dbl, client);

    if(config.dbl.usedbl && reqV[command] && message.author.id != config.settings.ownerid) {
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
                if(commandfile) commandfile.run(client, message, args, db, guildID);
            }
        }).catch(err => {
            if(commandfile) commandfile.run(client, message, args, db, guildID);
        });
    } else {
        if(commandfile) commandfile.run(client, message, args, db, guildID);
    }
}