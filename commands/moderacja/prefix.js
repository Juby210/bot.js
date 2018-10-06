const Discord = require("discord.js");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    if(message.member.hasPermission("MANAGE_GUILD") == true) {
        if(args[0] == null) {
            message.reply("Podaj prefix który ma być używany!");
            message.react("❌");
        } else {
            await db.update('guilds', guildID, 'prefix', args[0]);
            message.reply("Zaktualizowany prefix serwera to: ``" + args[0] + "``")
            message.react("✅");
        }
    } else {
        message.reply("Brak uprawnień!");
        message.react("❌");
    }
}    

module.exports.help = {
    name:"prefix",
    name2:"prefix <nowy prefix>",
    desc:"Ustawia nowy prefix dla bota na danym serwerze.",
    perms:"Zarządzanie serwerem"
}