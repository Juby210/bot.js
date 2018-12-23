const Discord = require('discord.js');
const config = require("../../config.json");
const DBL = require("dblapi.js");
let reqV = config.dbl.requireVote;
const db = require('../../util/db.js');
var logger = require("../../util/logger.js");

module.exports = async (message, client) => {
    let guildID;
    if(!message.guild) {
        return;
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);
    const prefix = await db.getPrefix(guildID);
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);

    if(message.author.bot) return;
    if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
        message.reply(strings.getMsg("myprefix").replace("#PREFIX#", prefix));
    }
    if (!message.content.startsWith(prefix)) return;

    if(config.globalbans) if(config.globalbans.includes(message.author.id)) {await require("../../util/util").gban(message); return;}

    let messageArray = message.content.split(" ");
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let cmod = messageArray[0];
    let commandfile = client.commands.get(cmod.slice(prefix.length));

    runcmd(command, commandfile, args, message, client, strings, prefix);
    if(config.logs.enabled) if(commandfile) logger.log(commandfile.name, args, message);
}

function runcmd(command, commandfile, args, message, client, strings, prefix) {
    const dbl = new DBL(config.tokens.dbl, client);

    if(config.dbl.usedbl && reqV[command] && message.author.id != config.settings.ownerid) {
        dbl.hasVoted(message.author.id).then(v => {
            if(!v) {
                var embed = new Discord.RichEmbed();
                embed.setColor("#A61818");
                embed.setTitle(strings.getMsg("cmdlocked_title"));
                embed.setDescription(strings.getMsg("cmdlocked_desc").replace("#ID#", client.user.id));
                embed.setFooter(strings.getMsg("cmdlocked_footer"));
                message.channel.send(embed);
                return;
            } else {
                if(commandfile) commandfile.run(client, message, args, strings, prefix);
            }
        }).catch(err => {
            if(commandfile) commandfile.run(client, message, args, strings, prefix);
        });
    } else {
        if(commandfile) commandfile.run(client, message, args, strings, prefix);
    }
}