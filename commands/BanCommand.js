const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    if(message.member.hasPermission("BAN_MEMBERS") == true) {
        if(args[0] == null) {
            message.reply("Podaj użytkownika do zbanowania!");
            message.react("❌");
        } else {
            var member = message.guild.members.find('id', message.mentions.users.first().id);
            if(member.bannable == true) {
                member.ban("Zbanowano przez użytkownika: " + message.author.tag);
                message.channel.send("Zbanowano użytkownika: " + member.user.username);
                message.react("✅");
            } else {
                message.channel.send("Bot nie ma uprawnień do zbanowania tego użytkownika!");
                message.react("❌");
            }
        }
    } else {
        message.reply("Brak uprawnień!");
        message.react("❌");
    }
}

module.exports.help = {
    name:"ban"
}