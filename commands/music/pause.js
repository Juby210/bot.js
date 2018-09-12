const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var index = require("../../index.js");

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    const player = client.player.get(message.guild.id);
    if (!player) return message.reply("aktualnie nic nie gram");
    await player.pause(true);
    message.react(index.emojiguild.emojis.get("488399581957324800"));
}

module.exports.help = {
    name:"pause",
    category:"MUZYKA"
}