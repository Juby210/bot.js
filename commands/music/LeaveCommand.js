const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var index = require("../../index.js");

module.exports.run = async (client, message, args) => {
    let queue = queuefile.getqueue;
    queue[message.guild.id].playing = false;
    queue[message.guild.id].songs = [];
    var bot = message.guild.member(client.user);
    if (bot.voiceChannel == undefined) {
        message.reply("bot nie jest połączony z żadnym kanałem!");
        return;
    }
    bot.voiceChannel.leave();
    message.react(index.emojiguild.emojis.get("488416404538785809"));
}

module.exports.help = {
    name: "leave",
    category: "MUZYKA",
    aliases: "disconnect"
}