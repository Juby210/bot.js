const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    let queue = queuefile.getqueue;
    let tosend = [];
    queue[message.guild.id].songs.forEach((song, i) => { tosend.push({c: i+1, title: song.title, requester: song.requester, length: song.length});});
    if(tosend == []) {
        message.channel.send("Kolejka tego serwera jest pusta!");
        return;
    }
    const embed = new Discord.RichEmbed;
    embed.setTitle(`Kolejka serwera ${message.guild.name}:`);
    tosend.forEach(e => {
        if(e.c >= 26) {embed.setFooter("Cała kolejka się nie zmieściła ;d"); return;}
        var length = e.length;
        formatlength(e.length, nlen => length = nlen);
        embed.addField(`${e.c}. ${e.title}`, `Długość: ${length} | Dodano przez: ${e.requester}`);
    });
	message.channel.send(embed);
}

function formatlength(ms, callback) {
    var h = Math.floor(ms / 1000 / 60 / 60);
    var min = Math.floor(ms / 1000 / 60 - h * 60);
    var sec = Math.floor(ms / 1000 - min * 60);
    
    var uh = false;
    if (!h == 0) {uh = true; if(h <= 9) {h = "0" + h;}}
    if (min <= 9) min = "0" + min;
    if (sec <= 9) sec = "0" + sec;
    var time = "";
    if(uh) {if(h >= 200) {time = "LIVE";} else {time = `${h}:${min}:${sec}`;}} else {time = `${min}:${sec}`;}
    if(time == "00:00") {callback("LIVE"); return;}
    callback(time);
}

module.exports.help = {
    name:"queue",
    aliases: ["list", "q"],
    name2:"queue",
    desc:"Pokazuje kolejkę dla serwera"
}