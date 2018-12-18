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
    if(message.member.hasPermission("BAN_MEMBERS") == true) {
        if(args[0] == null) {
            message.reply(`${strings.getMsg("user_null")}`);
            message.react("❌");
        } else {
            let msg = args.slice(1).join(' ');
            if (!msg) msg = `${strings.getMsg("nullreason")}`;
            await db.warn(message.mentions.users.first().id, guildID, msg[1]);
            
            const embed = new Discord.RichEmbed();
            embed.setAuthor(`${strings.getMsg("warn_title")}`);
            embed.setDescription(`${strings.getMsg("warn_msg").replace('#user#', message.mentions.users.first()).replace('#reason#', msg)}` + `\n${strings.getMsg("warn_msg_user").replace('#user1#', message.author.tag)}`);
            embed.setColor('#D5BEC6');
            embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
            embed.setTimestamp()
            message.channel.send(embed);
        }
    } else {
        message.reply(`${strings.getMsg("noperm")}`);
        message.react("❌");
    }
}

module.exports.help = {
    name:"warn"
}