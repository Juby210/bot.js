const Discord = require("discord.js");

module.exports.run = async (client, message, args, member) => {
    var embed = new Discord.RichEmbed;
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
    embed.setTitle("Avatar użytkownika:");
    embed.setDescription("**" + member.tag + "**" + "\n" + "[[Bezpośredni link]]" + "(" + member.avatarURL + ")");
    embed.setImage(member.avatarURL);
    embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
    embed.setTimestamp()
    message.channel.send(embed);
    }

module.exports.help = {
    name:"avatar",
    name2:"avatar [wzmianka/nazwa]",
    desc:"Wyświetla oraz daje link do avatara wybranej osoby/twojego"
}
