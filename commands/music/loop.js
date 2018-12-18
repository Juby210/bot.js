const Discord = require("discord.js");
const queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    let vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply(`${strings.getMsg("music_join")}`);
        return;
    }
    const player = client.player.get(message.guild.id);
    if (!player || !player.playing) return message.reply(`${strings.getMsg("music_nonp")}`);
    let queue = queuefile.getqueue;
    if(queue[message.guild.id].loop) {
        queue[message.guild.id].loop = false;
        message.channel.send(`${strings.getMsg("music_loopoff")}`);
    } else {
        queue[message.guild.id].loop = true;
        message.channel.send(`${strings.getMsg("music_loopon")}`);
    }
}

module.exports.help = {
    name:"loop"
}