const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var player = require("./f/player.js");

module.exports.run = async (client, message, args) => {
    if(args[0] == null) {
        var embed = new Discord.RichEmbed();
        embed.setColor("#ffd700");
        embed.setTitle("Lista stacji radiowych:");
        var desc = "";
        config.radiolist.forEach(r => desc += `${r.id}. ${r.name}\n`);
        embed.setDescription(desc + `\n${prefix}radio <numer> - odtwórz radio\nUWAGA! Eska i Vox mogą czasem nie działać!`);
        embed.setFooter(`Brakuje stacji radiowych? Napisz do Juby210#5831`);
        message.channel.send(embed);
    } else {
        var radio = {};
        var zn = false;
        config.radiolist.forEach(r => {
            if(args[0] == r.id) {
                radio = r;
                zn = true;
            }
        });
        if(!zn) {
            message.channel.send("Nie znaleziono takiego numeru radia, wpisz `" + prefix + "radio` po listę stacji.");
            return;
        }
        var vChannel = message.member.voiceChannel;
        if(vChannel == null) {
            message.reply("najpierw wejdź na kanał głosowy!");
            return;
        } else {
            if (message.guild.member(client.user).voiceChannel != vChannel) {
                vChannel.join().catch(err => index.anticrash(message.channel, err));
            }
        }
        let queue = queuefile.getqueue;
        queue[message.guild.id].songs = [];
        player.skip(message, false);
        message.channel.send("<:mplay:488399581470785557> Odtwarzanie: `" + radio.name + "`");
        player.playr(radio.url, message, radio.name);
    }
}

module.exports.help = {
    name:"radio",
    category:"MUZYKA"
}