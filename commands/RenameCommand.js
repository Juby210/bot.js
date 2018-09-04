const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async(client, message, args) => {
    if(!message.member.hasPermission("MANAGE_NICKNAMES")) {message.reply("Brak uprawnień!"); message.react("❌"); return;}
    if(message.mentions.users.first() == null) {
        var zn2 = false;
        message.guild.members.forEach(function(memb) {
            if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                memb.setNickname(text2);
                message.react("✅");
                zn2 = true;
            }
        });
        if (zn2 == false) {
            message.reply("nie znaleziono takiego użytkownika!");
            return;
        }
    } else {
        message.guild.members.find('id', message.mentions.users.first().id).setNickname(text2);
        message.react("✅");
    }
}

module.exports.help = {
    name:"rename",
    category:"MODERACJA"
}