const Discord = require('discord.js');
const client = new Discord.Client();
var queuefile = require('../commands/music/f/queue.js');
let voiceban = require("../voiceban.json");
const config = require("../config.json");
const index = require("../index.js");

module.exports = err => {
    console.log("AntiCrash:");
    console.log(err);
    var owner = client.users.find("id", config.ownerid);
    if(owner == undefined) {return;}
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${client.user.username} - AntiCrash`);
    embed.setDescription(err);
    embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
    embed.addField(err.path, err.method);
    embed.setColor("#FF0000");
    owner.send(embed);
}