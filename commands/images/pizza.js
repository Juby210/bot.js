const Discord = require("discord.js");
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    util.req("GET", "http://badosz.com/api/img/pizza").then(body => {
        var res = JSON.parse(body);
        var embed = new Discord.RichEmbed();
        embed.setImage(res.fulllink);
        embed.setColor("#E9A716");
        message.channel.send(embed);
    }).catch(err => util.crash(message.channel, err));
}

module.exports.help = {
    name:"pizza",
    name2:"pizza",
    desc:"Komenda obrazkowa"
}