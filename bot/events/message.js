const Discord = require('discord.js');
const config = require("../../config.json");
const DBL = require("dblapi.js");
let reqV = config.dbl.requireVote;
const db = require('../../util/db.js');
var logger = require("../../util/logger.js");

module.exports = async (message, client) => {
    client.stats.msg += 1;
    let guildID;
    if(!message.guild) {
        return;
    } else {
        guildID = message.guild.id;
    }
    await db.check(guildID);
    
    if(message.guild) {
    await db.addXP(message.author.id, guildID, message);
    }

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
    if(!commandfile) return;

    if(commandfile.category == "owner") if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    let p = [];
    commandfile.perms.forEach(perm => {
        if(!message.member.hasPermission(perm)) p.push(strings.getPerm(perm));
    });
    if(p.length != 0) return require("../command.js").error({emoji: client.guilds.get(config.settings.emojis.guild).emojis, emojis: config.settings.emojis, message, prefix}, `${strings.getMsg("reqperm")} \`${p.join("`, `")}\``);
    let bp = [];
    commandfile.botperms.forEach(perm => {
        if(!message.guild.member(client.user).hasPermission(perm)) bp.push(strings.getPerm(perm));
    });
    if(bp.length != 0) return require("../command.js").error({emoji: client.guilds.get(config.settings.emojis.guild).emojis, emojis: config.settings.emojis, message, prefix}, `${strings.getMsg("reqbotperm")} \`${bp.join("`, `")}\``);
    if(commandfile.reqVC) if(!message.member.voiceChannel) return require("../command.js").error({emoji: client.guilds.get(config.settings.emojis.guild).emojis, emojis: config.settings.emojis, message, prefix}, strings.getMsg("music_join"));
    
    runcmd(command, commandfile, args, message, client, strings, prefix);
    if(config.logs.enabled) logger.log(commandfile.name, args, message);
}

function runcmd(command, commandfile, args, message, client, strings, prefix) {
    const dbl = new DBL(config.tokens.dbl, client);
    const arg = {client, message, args, strings, prefix, emoji: client.guilds.get(config.settings.emojis.guild).emojis, config, emojis: config.settings.emojis};
    const util = require("../../util/util");

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
            } else commandfile.run(arg).catch(e => {util.crash(message.channel, e)});
        }).catch(err => {
            commandfile.run(arg).catch(e => {util.crash(message.channel, e)});
        });
    } else commandfile.run(arg).catch(e => {util.crash(message.channel, e)});
}