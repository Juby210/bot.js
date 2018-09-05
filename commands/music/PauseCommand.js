const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var player = require("./f/player.js");

module.exports.run = async (client, message, args) => {
    player.pause(message);
}

module.exports.help = {
    name:"pause",
    category:"MUZYKA"
}