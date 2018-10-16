const Discord = require("discord.js");
const request = require("request");

module.exports.run = async (client, message, args) => {
    var member = null;
    var member2 = null;
    if(args[0] == null) {
        message.reply("Podaj użytkownika!");
        message.react("❌");
    } else {
        if(message.mentions.users.first() == null) {
            var zn2 = false;
            message.guild.members.forEach(function(memb) {
                if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                    member = memb.user;
                    member2 = memb;
                    zn2 = true;
                }
            });
            if (zn2 == false) {
                message.reply("Nie znaleziono takiego użytkownika!");
                return;
            }
        } else {
            member = message.guild.members.find('id', message.mentions.users.first().id).user;
            member2 = message.guild.members.find('id', message.mentions.users.first().id);
        }
    }
        req("GET", "https://nekos.life/api/v2/img/pat").then(body => {
        var res = JSON.parse(body);
        var embed = new Discord.RichEmbed();
        var icon_url = "https://nekos.life/static/icons/favicon-194x194.png"
        embed.setDescription(message.author + " pogłaskał " + member2);
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
    name:"pat",
    name2:"pat [wzmianka/uzytkownik]",
    desc:"Komenda obrazkowa"
}
