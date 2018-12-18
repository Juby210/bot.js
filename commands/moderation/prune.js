const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(message.member.hasPermission("MANAGE_MESSAGES") == true) {
        if(args[0] == null) {
            message.reply(`${strings.getMsg("prune_value")}`);
            message.react("❌");
        } else {   
            const wartosc = parseInt(args[0], 10);
            if (wartosc >= 101) {
                message.channel.send("<:merror:489081457973919744> | " + `${strings.getMsg("prune_error")}` + "``" + wartosc + "``"); 
                return;
            } else {
            const wartosc = parseInt(args[0], 10);
            message.channel.fetchMessages({limit: wartosc +1}).then(messages => {
            message.channel.bulkDelete(wartosc).then(messages => {
            message.channel.send("<:mgreen_check_mark:488416404538785809> | " + `${strings.getMsg("prune_success")}` + "``" + messages.size + "``").then(message => message.delete(5000));
            });
        });
    }
}
    } else {
    message.reply(`${strings.getMsg("noperm")}`);
    message.react("❌");
    }
}
module.exports.help = {
    name: "prune",
    aliases: ["clear"]
}
