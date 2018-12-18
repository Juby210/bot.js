const Discord = require("discord.js");

module.exports.run = async(client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(args[0] == null) {message.channel.send(`${strings.getMsg("invalidarg")}`); message.react("❌"); return;}
    var text2 = args.slice(1).join(" ");
    if(!message.member.hasPermission("MANAGE_NICKNAMES")) {message.channel.send(`${strings.getMsg("reqperms")} \`${strings.getMsg("managenicknames")}\``); message.react("❌"); return;}
    if(message.mentions.users.first() == null) {
        var zn2 = false;
        message.guild.members.forEach(function(memb) {
            if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                memb.setNickname(text2).then(() => message.react("✅")).catch(err => {message.channel.send(`${strings.getMsg("rename_error")}`); message.react("❌"); return;});
                zn2 = true;
            }
        });
        if (zn2 == false) {
            message.reply(`${strings.getMsg("usernotfound")}`);
            return;
        }
    } else {
        message.guild.members.find('id', message.mentions.users.first().id).setNickname(text2).then(() => message.react("✅")).catch(err => {message.channel.send(`${strings.getMsg("rename_error")}`); message.react("❌"); return;});
    }
}

module.exports.help = {
    name:"rename"
}