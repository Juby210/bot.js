const Discord = require("discord.js");
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    var embed = new Discord.RichEmbed();
    embed.setImage("https://www.randomdoggiegenerator.com/randomdoggie.php");
    embed.setColor("#E9A716");
    message.channel.send(embed);
}

module.exports.help = {
    name:"dog",
    name2:"dog",
    desc:"Komenda obrazkowa"
}