const Discord = require("discord.js");
const db = require("../../util/db.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send(`${strings.getMsg("reqperms")} \`${strings.getMsg("movemembers")}\``); message.react("❌"); return;}
    if(message.mentions.users.first() == null) {message.reply(`${strings.getMsg("user_null")}`)} else {
        var zn = false;
        var memb = message.guild.member(message.mentions.users.first());

        await db.getVoiceBans(message.guild.id).then(async bany => {
            if(bany == undefined) return message.channel.send(`${strings.getMsg("voiceunban_error")}`);
            bany.forEach(async (id, i) => {
                if(id != memb.user.id) return;
                zn = true;
                bany.splice(i, 1);
                message.channel.send(`<@${id}>` + ` ${strings.getMsg("voiceunban_success")} ` + `${message.author.username}!`);
                await db.update('guilds', message.guild.id, 'voiceBans', bany);
            });
            if(!zn) {
                message.channel.send(`${strings.getMsg("voiceunban_error")}`);
            }
        });
    }
}

module.exports.help = {
    name: "voiceunban",
    aliases: ["unbanvoice"]
}