const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(!message.member.hasPermission("BAN_MEMBERS")) {message.reply(strings.getMsg("noperm")); return message.react("❌");}
    if(args[0] == null) {
        message.reply(`${strings.getMsg("user_null")}`);
        message.react("❌");
    } else {
        let reason = args.slice(1).join(' ');
        if(!reason) reason = strings.getMsg("nullreason");
        message.guild.ban(args[0], {reason:`${strings.getMsg("ban_by")} ${message.author.tag} ${strings.getMsg("reason")} ${reason}`}).then(user => {
            let e = new Discord.RichEmbed();
            e.setTitle("Hackban");
            e.setColor("#FF0000");
            e.setDescription(`${strings.getMsg("ban_user")} ${user.tag || `<@${user.id}>`} ${strings.getMsg("reason")} ${reason}`);
            message.channel.send(e);
            message.react("✅");
        }).catch(e => {
            message.react("❌");
            require("../../util/util").crash(message.channel, e);
        });
    }
}

module.exports.help = {
    name:"hackban"
}