const Discord = require("discord.js");
const util = require("../../util/util");
const config = require("../../config.json");
const snek = require("snekfetch");

module.exports.run = async (client, message, args) => {
    var text = util.polskieliterytoblad(args.join(' ')).replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    if(!text) return message.channel.send("Podaj jakiś text!");
    snek.get(`http://api.badosz.com/trump?text=${text}`).set({ Authorization: config.tokens.badosz}).then(response => {
        var embed = new Discord.RichEmbed();
        embed.attachFile({attachment: response.body, name: 'tweet.png'});
        embed.setImage("attachment://tweet.png");
        embed.setColor("#E9A716");
        embed.setFooter("api.badosz.com");
        message.channel.send(embed);
    }).catch(err => util.crash(message.channel, err));
}

module.exports.help = {
    name:"trump",
    name2:"trump [text]",
    desc:"Komenda obrazkowa"
}