const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
const request = require("request");

module.exports.run = async (client, message, args) => {
    req("GET", "http://badosz.com/api/img/pizza").then(body => {
        var res = JSON.parse(body);
        var embed = new Discord.RichEmbed();
        embed.setImage(res.fulllink);
        embed.setColor("#E9A716");
        message.channel.send(embed);
    });
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
    name:"pizza"
}