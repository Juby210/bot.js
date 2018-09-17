const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
const index = require("../../index.js");
var lock = false;

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.ownerid) return;
        message.delete();
    if(lock) {
        lock = false;
        client.user.setStatus(config.status);
    } else {
        lock = true;
        client.user.setStatus("invisible");
    }    
}    

module.exports.help = {
    name:"lockbot"
}  