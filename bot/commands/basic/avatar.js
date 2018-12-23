const Discord = require("discord.js");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = new cmd({
    name: "avatar",
    run: async (a = {}) => {
        const e = new Discord.RichEmbed();
        e.setColor(cmd.color());
        util.searchUser(a.message, a.args[0]).then(user => {
            e.setTitle(a.strings.getMsg("useravatar"));
            e.setDescription(a.strings.getMsg("useravatar_embed").replace("#TAG#", user.tag).replace("#ID#", user.id).replace("#URL#", user.avatarURL));
            e.setImage(user.avatarURL);
            e.setFooter(`© Juby210 & hamster | ${a.prefix}help`);
            a.message.channel.send(e);
        });
    }
});