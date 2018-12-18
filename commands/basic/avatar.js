const Discord = require("discord.js");
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);

    var embed = new Discord.RichEmbed; 
    util.searchUser(message, args[0]).then(user => {
        embed.setTitle(strings.getMsg("useravatar"));
        embed.setDescription(strings.getMsg("useravatar_embed").replace("#TAG#", user.tag).replace("#ID#", user.id).replace("#URL#", user.avatarURL));
        embed.setImage(user.avatarURL);
        embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
        embed.setTimestamp();
        message.channel.send(embed);
    });
}

module.exports.help = {
    name:"avatar"
}
