const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    if(message.author.id == config.ownerid) {
        client.user.setUsername(text).then(message.react("✅"));
    } else {
        message.react("❌");
    } 
}

module.exports.help = {
    name:"nick"
}