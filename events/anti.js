const Discord = require('discord.js');
const config = require("../config.json");
var index = require("../index.js")
const prefix = config.prefix;

module.exports.crash = async (chan, err, sendToOwner = true) => crash(chan, err, sendToOwner);
function crash(chan, err, sendToOwner = true) {
    console.log("AntiCrash:");
    console.log(err);
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${index.client.user.username} - <:merror:489081457973919744> AntiCrash`);
    embed.setDescription(err);
    embed.setColor("#FF0000");
    if(chan != null) chan.send("<:merror:489081457973919744> | Poinformuj nas o tym błędzie: https://discord.gg/t3xWk4X lub zgłoś to do Juby210#5831, hamster#0001 ``" + err + "``");
    if(!sendToOwner) return;
    var owner = index.client.users.find("id", config.settings.ownerid);
    if(owner == undefined) {return;}
    embed.addField(err.path, err.method);
    owner.send(embed);
}