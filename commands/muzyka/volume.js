const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    const player = client.player.get(message.guild.id);
    if(isNaN(args[0])) return message.channel.send("Podaj poprawną liczbę!");
    player.volume(args[0]);
    message.channel.send(":sound: | Głośność została zmieniona na: **" + args[0] + "%**");
}

module.exports.help = {
    name: "volume",
    category:"MUZYKA",
    aliases: "vol"
}