const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    var emojiguild = client.guilds.get("488293188247879680");
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
            message.react(emojiguild.emojis.get("488416404538785809"));
        }
    }
}

module.exports.help = {
    name: "join",
    name2: "join",
    desc: "Bot dołącza na twój kanał głosowy"
}