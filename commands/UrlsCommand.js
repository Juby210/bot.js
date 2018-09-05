const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
let urls = require("../urls.json");

module.exports.run = async (client, message, args) => {
if(!config.yourls.useyourls) {message.channel.send("Właściciel bota nie skonfigurował skracacza linków."); return;}
if(!urls.hasOwnProperty(message.author.id)) {message.channel.send("Nie masz swoich krótkich linków"); return;}
    var embed = new Discord.RichEmbed();
        embed.setTitle("Twoje krótkie linki: ");
    var tosend = [];
    urls[message.author.id].urls.forEach((url, i) => {tosend.push({c: i+1, short: url.short, full: url.full});});
    tosend.forEach(e => {
        embed.addField(`${e.c}. ${e.short}`, `Pełny link: ${e.full}`);
    });
    message.channel.send(embed);
}

module.exports.help = {
    name: "urls",
    category: "WEB"
}