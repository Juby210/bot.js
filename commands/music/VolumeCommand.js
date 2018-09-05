const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var player = require("./f/player.js");

module.exports.run = async (client, message, args) => {
    player.setvolume(message, args[0]);
}

module.exports.help = {
    name: "volume",
    category:"MUZYKA",
    aliases: "vol"
}