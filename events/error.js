const Discord = require('discord.js');
var index = require("../index.js");
const config = require("../config.json");

module.exports = (err) => {
    console.log("AntiCrash:");
    console.log(err);
    var owner = index.client.users.find("id", config.settings.ownerid);
    if(owner == undefined) {return;}
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${index.client.user.username} - <:merror:489081457973919744> AntiCrash`);
    embed.setDescription(err);
    embed.addField(err.path, err.method);
    embed.setColor("#FF0000");
    owner.send(embed);
}