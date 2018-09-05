const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
const index = require("../../index.js");

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    } else {
        if (message.guild.member(client.user).voiceChannel != vChannel) {
            vChannel.join().then(() => message.react("✅")).catch(err => index.anticrash(message.channel, err));
        }
    }
}

module.exports.help = {
    name: "join",
    category: "MUZYKA"
}