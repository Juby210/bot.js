const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
const request = require("request");
const db = require("../../util/db.js");

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);
    if(!config.yourls.useyourls) {message.channel.send(`Właściciel bota nie skonfigurował skracacza linków.`); return;}
    if(args[0] == null) {message.channel.send(`Nieprawidłowa ilość argumentów. Sprawdź poprawne użycie: ${prefix}info ${command}`); return;}
    var cust = false;
    if(args[1] != null) cust = true;
    if(cust) {
        request({
            method: "POST",
            url: `${config.yourls.apiurl}?signature=${config.tokens.yourls}&format=json&action=shorturl&url=${args[0]}&keyword=${args[1]}`
        }, async (error, response, body) => {
            if (error) return;
            if (response.statusCode == 200) {
                var result = JSON.parse(body);
                message.channel.send("Oto twój krótki url: " + result.shorturl);
                await db.addUrl(result.shorturl, args[0], message.author.id);
            }
        });
    } else {
        request({
            method: "POST",
            url: `${config.yourls.apiurl}?signature=${config.tokens.yourls}&format=json&action=shorturl&url=${args[0]}`
        }, async (error, response, body) => {
            if (error) return;
            if (response.statusCode == 200) {
                var result = JSON.parse(body);
                message.channel.send("Oto twój krótki url: " + result.shorturl);
                await db.addUrl(result.shorturl, args[0], message.author.id);
            }
        });
    }
}

module.exports.help = {
    name: "shorten"
}