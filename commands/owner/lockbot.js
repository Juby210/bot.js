const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
const index = require("../../index.js");
var lock = false;

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
        message.delete();
    if(lock) {
        lock = false;
        client.user.setStatus(config.settings.status);
    } else {
        lock = true;
        client.user.setStatus("invisible");
    }    
}    

module.exports.help = {
    name:"lockbot"
}  
