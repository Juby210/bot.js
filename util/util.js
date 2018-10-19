const Discord = require('discord.js');
const config = require("../config.json");
var index = require("../index.js");
const prefix = config.settings.prefix;
const request = require("request");

const crash = function AntiCrash(chan, err, sendToOwner = true) {
    console.log("AntiCrash:");
    console.log(err);
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${index.client.user.username} - AntiCrash`);
    embed.setDescription(err);
    embed.setColor("#FF0000");
    if(chan != null) chan.send("<:merror:489081457973919744> | Poinformuj nas o tym błędzie: https://discord.gg/t3xWk4X lub zgłoś to do Juby210#5831, hamster#0001 \n``" + err + "``");
    if(!sendToOwner) return;
    var owner = index.client.users.get(config.settings.ownerid);
    if(owner == undefined) return;
    embed.addField(err.path, err.method);
    owner.send(embed);
}

const ustawstatus = function ustawstatus(client = new Discord.Client()) {
    try{
        if (client.guilds.size == 1) {
            client.user.setPresence({ game: {name: `${prefix}help | 1 serwer`, type: 'LISTENING' }});
        } else {
            client.user.setPresence({ game: {name: `${prefix}help | ${client.guilds.size} serwerów`, type: 'LISTENING' }});
        }
    } catch(err) {}
}

const req = function req(method, url) {
    return new Promise((resolve, reject) => {
        request({
            method: method,
            url: url
        }, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    }).catch(err => console.log(err));
}

module.exports.crash = crash;
module.exports.ustawstatus = ustawstatus;
module.exports.req = req;