const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const DBL = require("dblapi.js");
    const dbl = new DBL(config.dbl.token, client);
    if(args[1] == null) {message.channel.send(`Nieprawidłowa ilość argumentów. Sprawdź poprawne użycie: ${prefix}info ${command}`); return;}
    if(args[0] == "user") {
        if(message.mentions.users.first() == null) {
            message.channel.send("Wzmiankuj użytkownika którego chcesz sprawdzić");
    } else {
        dbl.getUser(message.mentions.users.first().id).then(user => {
            var embed = new Discord.RichEmbed();
            var color = "#283593";
            var kolor = false;
            if(user.color != undefined) {color = user.color; kolor = true;}
            embed.setColor(color);
            if(!kolor) color = "Nie ustawiono koloru.";
            var bio = "Nie dodano bio.";
            var gh = "Nie dodano profilu.";
            var yt = "Nie dodano profilu.";
            var rd = "Nie dodano profilu.";
            var tw = "Nie dodano profilu.";
            var ig = "Nie dodano profilu.";
            if(user.bio != undefined) bio = user.bio;
            if(user.social) {
                try {
                    if(user.social.github != "") gh = user.social.github;
                    if(user.social.youtube != "") yt = user.social.youtube;
                    if(user.social.reddit != "") rd = user.social.reddit;
                    if(user.social.twitter != "") tw = user.social.twitter;
                    if(user.social.instagram != "") ig = user.social.instagram;
                } catch(err) {}
            }
            embed.setDescription(`Użytkownik: ${user.username}#${user.discriminator}\nID: ${user.id}\nAdmin/Mod/Mod strony: ${user.admin}`.replace("false", "nie").replace("true", "tak") + `/${user.mod}`.replace("false", "nie").replace("true", "tak") + `/${user.webMod}`.replace("false", "nie").replace("true", "tak") + `\nBio: ${bio}\nKolor: ${color}\nGithub: ${gh}\nYoutube: ${yt}\nReddit: ${rd}\nTwitter: ${tw}\nInstagram: ${ig}`);
            embed.setThumbnail(message.mentions.users.first().avatarURL);
            message.channel.send(embed);
        }).catch(err => index.anticrash(message.channel, err, false));
    }
} else if (args[0] == "bot") {
    if(message.mentions.users.first() == null) {
        message.channel.send("Wzmiankuj bota, którego chcesz wyszukać");                
    } else {
        dbl.getBot(message.mentions.users.first().id).then(fbot => {
            var embed = new Discord.RichEmbed();
            embed.setColor("#283593");
            var desc = fbot.longdesc;
            if(desc == "" || desc == undefined) desc = fbot.shortdesc;
            var owners = "";
            fbot.owners.forEach(oid => {
                try{
                    if(owners == "") {owners = client.users.find("id", oid).tag;} else {
                        owners = owners + ", " + client.users.find("id", oid).tag;
                    }
                } catch(err) {}
            });
            embed.setDescription(`Nazwa: ${fbot.username}#${fbot.discriminator}\nID: ${fbot.id}\nOpis:\n${desc}\n[Invite](${fbot.invite})\nStrona bota: ${fbot.website}\nKod: ${fbot.github}\nPrefix: ${fbot.prefix}\nBiblioteka: ${fbot.lib}\nTwórca: ${owners}\nTagi: ${fbot.tags + ""}\nGłosy: ${fbot.points}\n[Pokaż na discordbots.org](https://discordbots.org/bot/${fbot.id})`);
            embed.setThumbnail(message.mentions.users.first().avatarURL);
            message.channel.send(embed);
        }).catch(err => index.anticrash(message.channel, err, false));
    }
}
}

module.exports.help = {
    name: "dbl",
    category: "WEB",
    aliases: "discordbotlist"
}