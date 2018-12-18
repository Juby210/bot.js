const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;

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
    await player.stop();
    message.react(emojiguild.emojis.get("488399581965451265"));
}

module.exports.help = {
    name: "skip",
    aliases: [">>", "s"]
}