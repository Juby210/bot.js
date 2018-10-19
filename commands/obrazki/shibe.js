const Discord = require("discord.js");
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    util.req("GET", "http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true").then(body => {
        var res = JSON.parse(body);
        var embed = new Discord.RichEmbed();
        embed.setImage(res[0]);
        embed.setColor("#E9A716");
        message.channel.send(embed);
    }).catch(err => util.crash(message.channel, err));
}

module.exports.help = {
    name:"shibe",
    name2:"shibe",
    desc:"Komenda obrazkowa"
}