const Discord = require("discord.js");
const util = require("../../util/util");
const config = require("../../config.json");
const snek = require("snekfetch");

module.exports.run = async (client, message, args) => {
    snek.get(`http://api.badosz.com/dog`).set({Authorization: config.tokens.badosz}).then(response => {
        var embed = new Discord.RichEmbed();
        embed.attachFile({attachment: response.body, name: 'dog.png'});
        embed.setImage("attachment://dog.png");
        embed.setColor("#E9A716");
        embed.setFooter("api.badosz.com");
        message.channel.send(embed);
    }).catch(err => util.crash(message.channel, err));
}

module.exports.help = {
    name:"dog"
}
