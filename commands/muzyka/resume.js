const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    var emojiguild = client.guilds.get("488293188247879680");
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    const player = client.player.get(message.guild.id);
    if (!player) return message.reply("aktualnie nic nie gram");
    await player.pause(false);
    message.react(emojiguild.emojis.get("488399581470785557"));
}

module.exports.help = {
    name: "resume",
    name2: "resume",
    desc: "Wznawia odtwarzacz"
}