const Discord = require("discord.js");
const request = require("request");

module.exports.run = async (client, message, args) => {
    req("GET", "https://nekos.life/api/v2/img/avatar").then(body => {
        var res = JSON.parse(body);
        var embed = new Discord.RichEmbed();
        embed.setImage(res.url);
        embed.setColor("#E9A716");
        embed.setFooter("napędzane przez nekos.life", icon_url);
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
    name:"avatary",
    name2:"avatary",
    desc:"Komenda obrazkowa"
}