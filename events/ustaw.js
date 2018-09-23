const Discord = require('discord.js');
var index = require("../index.js");
const config = require("../config.json");
const prefix = config.settings.prefix;

module.exports.status = client => status(client);
function status(client = new Discord.Client()) {
    try{
        if (client.guilds.size == 1) {
            client.user.setPresence({ game: {name: `${prefix}help | 1 serwer`, type: 'LISTENING' }});
        } else {
            client.user.setPresence({ game: {name: `${prefix}help | ${client.guilds.size} serwerów`, type: 'LISTENING' }});
        }
    } catch(err) {}
} 