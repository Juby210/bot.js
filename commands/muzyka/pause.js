const Discord = require("discord.js");
const queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    let emojiguild = client.guilds.get("488293188247879680");
    let vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    const player = client.player.get(message.guild.id);
    if (!player) return message.reply("aktualnie nic nie gram");
    await player.pause(true);
    queuefile.pause(message.guild.id);
    message.react(emojiguild.emojis.get("488399581957324800"));
}

module.exports.help = {
    name:"pause",
    name2:"pause",
    desc:"Zatrzymuje odtwarzacz"
}