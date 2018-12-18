const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(message.member.hasPermission("KICK_MEMBERS") == true) {
        if(args[0] == null) {
            message.reply(`${strings.getMsg("user_null")}`);
            message.react("❌");
        } else {
                var member = message.guild.members.find('id', message.mentions.users.first().id);
                if (member.kickable == true) {
                    let reason = args.slice(1).join(' ');
                    if(!reason) reason = `${strings.getMsg("nullreason")}`;
                    member.kick(`${strings.getMsg("kick_by")} ` + message.author.tag + " " + `${strings.getMsg("reason")} ${reason}`);
                    message.channel.send(`${strings.getMsg("kick_user")} ` + member.user.username + " " + `${strings.getMsg("reason")} ${reason}`);
                    message.react("✅");
                } else {
                    message.channel.send(`${strings.getMsg("kick_perm")}`);
                    message.react("❌");
                }
            }
        } else {
            message.reply(`${strings.getMsg("noperm")}`);
            message.react("❌");
        }
    }    

module.exports.help = {
    name:"kick"
}