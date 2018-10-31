const Discord = require("discord.js");
const util = require("../../util/util");
const config = require("../../config.json");
const snek = require("snekfetch");

module.exports.run = async (client, message, args) => {
    var text = util.polskieliterytoblad(args.join(' '));
    snek.get(`http://api.badosz.com/changemymind?text=${text}`).set({ Authorization: config.tokens.badosz}).then(response => {
        var embed = new Discord.RichEmbed();
        embed.attachFile({attachment: response.body, name: 'changemymind.png'});
        embed.setImage("attachment://changemymind.png");
        embed.setColor("#E9A716");
        embed.setFooter("api.badosz.com");
        message.channel.send(embed);
    }).catch(err => util.crash(message.channel, err));
}

module.exports.help = {
    name:"changemymind",
    aliases: ["cmm"],
    name2:"changemymind [text]",
    desc:"Komenda obrazkowa"
}