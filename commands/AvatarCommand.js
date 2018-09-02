const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const index = require("../index.js");
require('format4js');


module.exports.run = async (client, message, args, member) => {
    var embed = new Discord.RichEmbed;
    let target = message.mentions.users.first() || message.author;
    embed.addField(String.format("Avatar użytkownika:", target.name + "#" + target.descriminator), String.format("[%s](%s)", "Bezpośedni link", target.getEffectiveAvatarUrl), false);
    embed.setImage(target.avatarURL + "?size=1024");
    embed.setFooter("© Juby210", client.user.avatarURL);
    embed.setTimestamp()
    message.channel.send(embed);
    }

module.exports.help = {
    name:"avatar"
}
