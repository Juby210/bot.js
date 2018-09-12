const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var index = require("../../index.js");

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    let queue = queuefile.getqueue;
    queue[message.guild.id].playing = false;
    queue[message.guild.id].songs = [];
    await client.player.leave(message.guild.id);
    message.react(index.emojiguild.emojis.get("488416404538785809"));
}

module.exports.help = {
    name: "leave",
    category: "MUZYKA",
    aliases: "disconnect"
}