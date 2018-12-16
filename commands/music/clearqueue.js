const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);

    var emojiguild = client.guilds.get("488293188247879680");
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply(`${strings.getMsg("music_clearqueue")}`);
        return;
    }
    let queue = queuefile.getqueue;
    queue[message.guild.id].songs = [];
    message.react(emojiguild.emojis.get("488416404538785809"));
}

module.exports.help = {
    name:"clearqueue",
    aliases:["cq"],
    name2:"clearqueue",
    desc:"Czyści kolejkę dla serwera"
}