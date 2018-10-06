const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    var emojiguild = client.guilds.get("488293188247879680");
    var vChannel = message.member.voiceChannel;
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
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