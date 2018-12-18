const Discord = require("discord.js");
const util = require("../../util/util");
const config = require("../../config.json");
const snek = require("snekfetch");

module.exports.run = async (client, message, args) => {
    const db = require("../../util/db.js");
    const prefix = await db.getPrefix(message.guild.id);
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);

    var text = encodeURIComponent(args.join(' '));
    if(!text) return message.channel.send(strings.getMsg("invalidargscount").replace("#PREFIX#", prefix).replace("#CMD#", "trump"));
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