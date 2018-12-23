const Discord = require("discord.js");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = new cmd({
    name: "avatar",
    run: async (client, message, args, strings, prefix) => {
        const e = new Discord.RichEmbed();
        e.setColor(cmd.color());
        util.searchUser(message, args[0]).then(user => {
            e.setTitle(strings.getMsg("useravatar"));
            e.setDescription(strings.getMsg("useravatar_embed").replace("#TAG#", user.tag).replace("#ID#", user.id).replace("#URL#", user.avatarURL));
            e.setImage(user.avatarURL);
            e.setFooter(`© Juby210 & hamster | ${prefix}help`);
            message.channel.send(e);
        });
    }
});