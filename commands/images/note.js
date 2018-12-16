const Discord = require("discord.js");
const util = require("../../util/util");
const config = require("../../config.json");
const snek = require("snekfetch");

module.exports.run = async (client, message, args) => {
    var text = encodeURIComponent(args.join(' '));
    if(!text) return message.channel.send("Podaj jakiś text!");
    snek.get(`http://api.badosz.com/note?text=${text}`).set({Authorization: config.tokens.badosz}).then(response => {
        var embed = new Discord.RichEmbed();
        embed.attachFile({attachment: response.body, name: 'note.png'});
        embed.setImage("attachment://note.png");
        embed.setColor("#E9A716");
        embed.setFooter("api.badosz.com");
        message.channel.send(embed);
    }).catch(err => util.crash(message.channel, err));
}

module.exports.help = {
    name:"note",
    name2:"note [text]",
    desc:"Komenda obrazkowa"
}