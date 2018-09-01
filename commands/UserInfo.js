const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    var gra = "Użytkownik w nic nie gra."
    var stream = false;
    var member = null;
    var member2 = null;
    if(args[0] == null) {
        member = message.author;
        member2 = message.member;
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
                message.reply("nie znaleziono takiego użytkownika!");
                return;
            }
        } else {
            member = message.guild.members.find('id', message.mentions.users.first().id).user;
            member2 = message.guild.members.find('id', message.mentions.users.first().id);
        }
    }
    try {
        var gra = member.presence.game.name;
        stream = member.presence.game.streaming;
    } catch(err) {}
    var role = "";
    member2.roles.forEach(r => {
        if (role == "") {
            role += r.name;
        } else {
            role += ", " + r.name;
        }
    });
    var pseudo = member2.nickname;
    if(pseudo == null) {pseudo = member.username;}
    message.channel.send({embed: {
        color: 0xf1c40f,
        author: {
            name: member.tag,
            icon_url: member.avatarURL
        },
        fields: [{
            name: "Nick:",
            value: member.username,
            inline: true
        }, {
            name: "Tag:",
            value: member.discriminator,
            inline: true
        }, {
            name: "Pseudonim:",
            value: pseudo,
            inline: true
        }, {
            name: "Gra:",
            value: gra
        }, {
            name:"Stream:",
            value: stream,
            inline: true
        }, {
            name:"ID:",
            value: member.id,
            inline: true
        }, {
            name:"Status:",
            value: member.presence.status,
            inline: true
        }, {
            name: "Konto stworzone:",
            value: member.createdAt,
            inline: true
        }, {
            name: "Dołączono na serwer:",
            value: member2.joinedAt,
            inline: true
        }, {
            name:"Role [" + member2.roles.size + "]:",
            value: role,
            inline: true
        }],
        thumbnail: {
            url: member.avatarURL
        }
    }});
}

module.exports.help = {
    name:"userinfo"
  }