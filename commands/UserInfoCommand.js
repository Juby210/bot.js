const Discord = require("discord.js");
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
                message.reply("Nie znaleziono takiego użytkownika!");
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
    var embed = new Discord.RichEmbed;
    embed.setColor("0xf1c40f")
    embed.setAuthor(member.tag, member.avatarURL);
    embed.addField("Nick:", member.username, true);
    embed.addField("Tag:", "#" + member.discriminator, true);
    embed.addField("Pseudonim:", pseudo, true);
    embed.addField("Gra:", gra);
    embed.addField("Stream:", stream, true);
    embed.addField("ID:", member.id, true);
    embed.addField("Status:", member.presence.status, true);
    embed.addField("Konto stworzone:", member.createdAt, true);
    embed.addField("Dołączono na serwer:", member2.joinedAt, true);
    embed.addField("Role [" + member2.roles.size + "]:", role, true);
    embed.setThumbnail(member.avatarURL);
    embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
    embed.setTimestamp()
    message.channel.send(embed);
}

module.exports.help = {
    name:"userinfo"
}