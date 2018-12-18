const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    var emojiguild = client.guilds.get("488293188247879680");
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply(`${strings.getMsg("music_join")}`);
        return;
    } else {
        if (message.guild.member(client.user).voiceChannel != vChannel) {
            await client.player.join({
                guild: message.guild.id,
                channel: vChannel.id,
                host: config.lavalink.host
            }, { selfdeaf: true });
            message.react(emojiguild.emojis.get("488416404538785809"));
        }
    }
}

module.exports.help = {
    name: "join"
}