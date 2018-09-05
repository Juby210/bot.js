const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    let queue = queuefile.getqueue;
    queue[message.guild.id].songs = [];
    queuefile.update(queue);
    message.react("✅");
}

module.exports.help = {
    name:"clearqueue",
    category:"MUZYKA",
    aliases:"cq"
}