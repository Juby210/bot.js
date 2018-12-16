const Discord = require("discord.js");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(message.member.hasPermission("MANAGE_GUILD") == true) {
        if(args[0] == null) {
            message.reply(`${strings.getMsg("prefix_null")}`);
            message.react("❌");
        } else {
            await db.update('guilds', guildID, 'prefix', args[0]);
            message.reply(`${strings.getMsg("prefix_done")} ` + "``" + args[0] + "``")
            message.react("✅");
        }
    } else {
        message.reply(`${strings.getMsg("noperm")} `);
        message.react("❌");
    }
}    

module.exports.help = {
    name:"prefix",
    name2:"prefix <nowy prefix>",
    desc:"Ustawia nowy prefix dla bota na danym serwerze.",
    perms:"Zarządzanie serwerem"
}