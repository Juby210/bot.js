const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    var totalSec = client.uptime / 1000;
    var hours = Math.floor(totalSec / 3600);
    totalSec %= 3600;
    var mins = Math.floor(totalSec / 60);
    var secs = Math.floor(totalSec % 60);
    message.channel.send(`Jestem aktywny od: *${hours} godzin, ${mins} minut i ${secs} sekund*`);
}

module.exports.help = {
    name: "uptime"
}