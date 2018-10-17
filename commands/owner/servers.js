const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    let tosend = [];
    var i = 0;
    client.guilds.forEach(g => { i += 1; tosend.push({c: i, title: g.name, id: g.id, owner: g.owner.user.username});});
    const embed = new Discord.RichEmbed;
    embed.setTitle(`Serwery:`);
    tosend.forEach(e => {
        embed.addField(`${e.c}. ${e.title}`, `ID: ${e.id} | Właściciel: ${e.owner}`);
    });
    message.author.send(embed);
}    

module.exports.help = {
    name:"servers"
}  