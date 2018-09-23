const Discord = require("discord.js");
const request = require("request");
var index = require("../../index.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    if(!args[0]) {message.channel.send("Nie prawidłowa ilość argumentów!"); return;}
    if(!message.member.hasPermission("MANAGE_CHANNELS")) {message.channel.send("Ta komenda wymaga uprawnienia `Zarządzanie kanałami`"); return;}
    if(isNaN(args[0])) {message.channel.send(`Podaj liczbę, a nie ${args[0]}`); return;}
    if(args[0] >= 121) {message.channel.send("Max. 120 sek"); return;}
    req("PATCH", `https://discordapp.com/api/channels/${message.channel.id}`, config.tokens.token, args[0]).then(body => {
        if(args[0] == 0) {
            message.channel.send("Usunięto slowmode!");
        } else {
            message.channel.send(`Ustawiono na **${args[0]}sek**!`);
        }
    }).catch(err => index.anticrash(message.channel, err));
}

function req(method, url, token, num) {
    return new Promise((resolve, reject) => {
        request({
            method: method,
            url: url,
            json: {rate_limit_per_user: num},
            headers: {
                Authorization: "Bot " + token
            },
            form: ""
        }, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    }).catch(err => console.log(err));
}

module.exports.help = {
    name:"slowmode",
}