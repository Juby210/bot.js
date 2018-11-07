const Discord = require("discord.js");
const util = require("../../util/util");
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    let queue = queuefile.getqueue;
    var song = queue[message.guild.id].song;
    const player = client.player.get(message.guild.id);
    let tosend = [];
    queue[message.guild.id].songs.forEach((song, i) => { tosend.push({c: i+1, title: song.title, requester: song.requester, length: song.length});});
    if(tosend == []) {
        message.channel.send("Kolejka tego serwera jest pusta!");
        return;
    }
    const embed = new Discord.RichEmbed;
    embed.setTitle(`Kolejka serwera ${message.guild.name}:`);
    embed.setDescription('Teraz gram: **' + song.title + "**")
    if (!player.playing) embed.setDescription('Teraz gram: **Brak**');
    tosend.forEach(e => {
        if(e.c >= 26) {embed.setFooter("Cała kolejka się nie zmieściła ;d"); return;}
        var length = util.formatLength(e.length);
        embed.addField(`${e.c}. ${e.title}`, `Długość: ${length} | Dodano przez: ${e.requester}`);
    });
	message.channel.send(embed);
}

module.exports.help = {
    name:"queue",
    aliases: ["list", "q"],
    name2:"queue",
    desc:"Pokazuje kolejkę dla serwera"
}