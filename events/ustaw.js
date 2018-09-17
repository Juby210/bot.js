const Discord = require('discord.js');
var index = require("../index.js");

module.exports.status = client => status(client);
function status(client = new Discord.Client()) {
    try{
        if (client.guilds.size == 1) {
            client.user.setPresence({ game: {name: `${prefix}help | 1 serwer`, type: 'WATCHING' }});
        } else {
            client.user.setPresence({ game: {name: `${prefix}help | ${client.guilds.size} serwerów`, type: 'WATCHING' }});
        }
    } catch(err) {}
}