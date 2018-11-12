const Discord = require("discord.js");
const queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    let vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }
    const player = client.player.get(message.guild.id);
    if (!player || !player.playing) return message.reply("aktualnie nic nie gram");
    let queue = queuefile.getqueue;
    if(queue[message.guild.id].loop) {
        queue[message.guild.id].loop = false;
        message.channel.send("Loop wyłączony!");
    } else {
        queue[message.guild.id].loop = true;
        message.channel.send("Loop włączony!");
    }
}

module.exports.help = {
    name:"loop",
    name2:"loop",
    desc:"Zapętla aktualną piosenkę"
}