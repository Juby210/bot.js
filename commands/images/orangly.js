const Discord = require("discord.js");
const util = require("../../util/util");
const config = require("../../config.json");
const snek = require("snekfetch");

module.exports.run = async (client, message, args) => {
    util.searchUser(message, args[0]).then(user => {
        snek.get(`http://api.badosz.com/orangly?url=${user.avatarURL}`).set({ Authorization: config.tokens.badosz}).then(response => {
            var embed = new Discord.RichEmbed();
            embed.attachFile({attachment: response.body, name: 'orangly.png'});
            embed.setImage("attachment://orangly.png");
            embed.setColor("#E9A716");
            embed.setDescription(`${user.tag} (${user.id})`);
            embed.setFooter("api.badosz.com");
            message.channel.send(embed);
        }).catch(err => util.crash(message.channel, err));
    });
}

module.exports.help = {
    name:"orangly"
}