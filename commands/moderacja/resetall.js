const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(message.member.hasPermission("MANAGE_NICKNAMES") == true) {
        if(message.guild.member(client.user).hasPermission("MANAGE_NICKNAMES") == true) {
            message.reply(`${strings.getMsg("rename_reset")}`);
            message.guild.members.forEach(mem => {
            mem.setNickname("");
            });
            message.react("✅");
        } else {
            message.channel.send(`${strings.getMsg("rename_botperm")}`);
            message.react("❌");
        }
    } else {
        message.reply(`${strings.getMsg("noperm")}`);
        message.react("❌");
    }
}

module.exports.help = {
    name:"resetall",
    name2:"resetall",
    desc:"Resetuje wszystkim pseudonimy",
    perms:"Zarządzanie pseudonimami"
}