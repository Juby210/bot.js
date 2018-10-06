const Discord = require("discord.js");
const db = require("../../util/db.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    if(!config.yourls.useyourls) {message.channel.send("Właściciel bota nie skonfigurował skracacza linków."); return;}
    var embed = new Discord.RichEmbed();
    embed.setTitle("Twoje krótkie linki: ");
    var tosend = []
    var urls = await db.getUrls(message.author.id);
    if(urls == false) {message.channel.send("Nie masz swoich krótkich linków"); return;}
    urls.forEach((url, i) => {tosend.push({c: i+1, short: url.short, full: url.full});});
    tosend.forEach(e => {
        embed.addField(`${e.c}. ${e.short}`, `Pełny link: ${e.full}`);
    });
    message.channel.send(embed);
}

module.exports.help = {
    name: "urls",
    name2: "urls",
    desc: "Pokazuje twoje skrócone linki"
}