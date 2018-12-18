const Discord = require("discord.js");
const queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    var emojiguild = client.guilds.get("488293188247879680");
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply(`${strings.getMsg("music_join")}`);
        return;
    }
    const player = client.player.get(message.guild.id);
    if (!player) return message.reply(`${strings.getMsg("music_nonp")}`);
    await player.pause(false);
    queuefile.pause(message.guild.id, false);
    message.react(emojiguild.emojis.get("488399581470785557"));
}

module.exports.help = {
    name: "resume"
}