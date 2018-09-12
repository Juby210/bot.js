const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
const index = require("../..");

module.exports.run = async (client, message, args) => {
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    } else {
        if (message.guild.member(client.user).voiceChannel != vChannel) {
            await client.player.join({
                guild: message.guild.id,
                channel: vChannel.id,
                host: config.lavalink.host
            }, { selfdeaf: true });
            message.react(index.emojiguild.emojis.get("488416404538785809"));
        }
    }
}

module.exports.help = {
    name: "join",
    category: "MUZYKA"
}