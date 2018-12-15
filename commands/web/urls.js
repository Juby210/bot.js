const Discord = require("discord.js");
const db = require("../../util/db.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(!config.yourls.useyourls) {message.channel.send(`${strings.getMsg("shorten_noconfig")}`); return;}
    var embed = new Discord.RichEmbed();
    embed.setTitle(`${strings.getMsg("urls_title")}` + " ");
    var tosend = []
    var urls = await db.getUrls(message.author.id);
    if(urls == false) {message.channel.send(`${strings.getMsg("urls_nothing")}`); return;}
    urls.forEach((url, i) => {tosend.push({c: i+1, short: url.short, full: url.full});});
    tosend.forEach(e => {
        embed.addField(`${e.c}. ${e.short}`, `${strings.getMsg("urls_fulllink")}` + `${e.full}`);
    });
    message.channel.send(embed);
}

module.exports.help = {
    name: "urls",
    name2: "urls",
    desc: "Pokazuje twoje skrócone linki"
}