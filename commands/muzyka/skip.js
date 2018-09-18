const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    var emojiguild = client.guilds.get("488293188247879680");
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    const player = client.player.get(message.guild.id);
    await player.stop();
    message.react(emojiguild.emojis.get("488399581965451265"));
}

module.exports.help = {
    name: "skip",
    category: "MUZYKA",
    aliases: ">>"
}