const Discord = require("discord.js");
const db = require('../../util/db.js');
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.ownerid && message.author.id != config.devid) return;
        await db.updateStats(message.client.guilds.size, message.client.channels.size, message.client.users.size);
        message.react("✅");
    }
module.exports.help = {
    name:"staty"
}