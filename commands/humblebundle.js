const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const request = require("request");
var index = require("../index.js");

module.exports.run = async (client, message, args) => {
    req("GET", `https://www.humblebundle.com/androidapp/v2/service_check`).then(body => {
        var res = JSON.parse(body);
        var zn = false;
        var embed = new Discord.RichEmbed();
        embed.setDescription(`<:mlist:488406259230310440> | Lista konkursów:`);
        res.forEach(b => {
            zn = true; 
            embed.addField(b.bundle_name, b.url);
        });
        if(!zn) {
            embed.setDescription(embed.description + "\nBrak");
        }
        message.channel.send(embed);
    }).catch(err => index.anticrash(message.channel, err));
}

function req(method, url) {
    return new Promise((resolve, reject) => {
        request({
            method: method,
            url: url,
            form: ""
        }, (error, response, body) => {
            if (error) return reject(error);
            resolve(body);
        });
    }).catch(err => console.log(err));
}

module.exports.help = {
    name:"humblebundle",
    category:"WEB",
    aliases:"hb"
}