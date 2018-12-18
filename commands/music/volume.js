const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply(`${strings.getMsg("music_join")}`);
        return;
    }
    const player = client.player.get(message.guild.id);
    if(isNaN(args[0])) return message.channel.send(`${strings.getMsg("music_volume_number")}`);
    player.volume(args[0]);
    message.channel.send(":sound: | " + `${strings.getMsg("music_volume").replace("#VOL#", args[0])}`);
}

module.exports.help = {
    name: "volume",
    aliases: ["vol"]
}