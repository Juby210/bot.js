const Discord = require("discord.js");
const db = require("../../util/db.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send(`${strings.getMsg("reqperms")} \`${strings.getMsg("movemembers")}\``); message.react("❌"); return;}
    if(!args[0]) {message.channel.send(`${strings.getMsg("user_null")}`); return;}
    if(message.mentions.users.first() == null) {
        var zn2 = false;
        message.guild.members.forEach(async memb => {
            if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                if(memb.user.id == client.user.id) {message.reply(`${strings.getMsg("botisntuser")}`); return;}
                zn2 = true;
                message.guild.createChannel("Kick", "voice").then(vChan => {
                    memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                }).catch(err => anticrash(message.channel, err));
                message.react("✅");
                await db.getVoiceBans(message.guild.id).then(async bany => {
                    if(bany == undefined) bany = [];
                    bany.push(memb.user.id);
                    await db.update('guilds', message.guild.id, 'voiceBans', bany);
                });
            }
        });
        if (zn2 == false) {
            message.reply(`${strings.getMsg("usernotfound")}`);
            return;
        }
    } else {
        var memb = message.guild.member(message.mentions.users.first());
        if(memb.user.id == client.user.id) {message.reply(`${strings.getMsg("botisntuser")}`); return;}
        message.guild.createChannel("Kick", "voice").then(vChan => {
            memb.setVoiceChannel(vChan).then(mem => vChan.delete());
        }).catch(err => anticrash(message.channel, err));
        message.react("✅");
        await db.getVoiceBans(message.guild.id).then(async bany => {
            if(bany == undefined) bany = [];
            bany.push(memb.user.id);
            await db.update('guilds', message.guild.id, 'voiceBans', bany);
        });
    }
}

module.exports.help = {
    name: "voiceban",
    aliases: ["banvoice"],
    name2:"voiceban <wzmianka/osoba>",
    desc:"Blokuje możliwość wejścia na kanały głosowe wskazanej osobie na zawsze",
    perms:"Przenieś członków"
}