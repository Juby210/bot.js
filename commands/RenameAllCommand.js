const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
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

module.exports.help = {
    name:"renameall"
}