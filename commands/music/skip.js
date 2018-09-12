const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var index = require("../../index.js");
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    const player = client.player.get(message.guild.id);
    await player.stop();
    message.react(index.emojiguild.emojis.get("488399581965451265"));
}

module.exports.help = {
    name: "skip",
    category: "MUZYKA",
    aliases: ">>"
}