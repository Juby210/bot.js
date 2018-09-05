const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    let queue = queuefile.getqueue;
    let tosend = [];
    queue[message.guild.id].songs.forEach((song, i) => { tosend.push({c: i+1, title: song.title, requester: song.requester, duration: song.duration});});
    if(tosend == []) {
        message.channel.send("Kolejka tego serwera jest pusta!");
        return;
    }
    const embed = new Discord.RichEmbed;
    embed.setTitle(`Kolejka serwera ${message.guild.name}:`);
    tosend.forEach(e => {
        embed.addField(`${e.c}. ${e.title}`, `Długość: ${e.duration} | Dodano przez: ${e.requester}`);
    });
	message.channel.send(embed);
}

module.exports.help = {
    name:"queue",
    category:"MUZYKA",
    aliases:"q"
}