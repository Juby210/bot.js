const Discord = require("discord.js");
const config = require("../../config.json");
const db = require("../../util/db.js");
var rp = require("request-promise");
var cheerio = require('cheerio');
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);
    const DBL = require("dblapi.js");
    const dbl = new DBL(config.tokens.dbl, client);
    if(args[0] == null) {message.channel.send(`Nieprawidłowa ilość argumentów. Sprawdź poprawne użycie: ${prefix}info ${command}`); return;}
    var useri;
    if(args[0].includes("<@")) {
        useri = message.mentions.users.first().id;
    } else useri = args[0];
    if(message.guild.members.get(useri) == undefined) return message.channel.send("Nie znaleziono!");
    if(message.guild.members.get(useri).user.bot) {
        dbl.getBot(useri).then(fbot => {
            var embed = new Discord.RichEmbed();
            embed.setColor("#283593");
            var desc = fbot.longdesc;
            if(desc == "" || desc == undefined) desc = fbot.shortdesc;
            var owners = "";
            fbot.owners.forEach(oid => {
                try{
                    if(owners == "") {owners = client.users.get(oid).tag;} else {
                        owners = owners + ", " + client.users.get(oid).tag;
                    }
                } catch(err) {}
            });
            embed.setDescription(`Nazwa: ${fbot.username}#${fbot.discriminator}\nID: ${fbot.id}\nOpis:\n${desc}\n[Invite](${fbot.invite})\nStrona bota: ${fbot.website}\nKod: ${fbot.github}\nPrefix: ${fbot.prefix}\nBiblioteka: ${fbot.lib}\nTwórca: ${owners}\nTagi: ${fbot.tags + ""}\nGłosy: ${fbot.points}\n[Pokaż na discordbots.org](https://discordbots.org/bot/${fbot.id})`);
            embed.setThumbnail(message.guild.members.get(useri).user.avatarURL);
            message.channel.send(embed);
        }).catch(err => {
            if(err.status == 404) return message.channel.send("Nie znaleziono!");
            util.crash(message.channel, err, false);
        });
    } else {
        dbl.getUser(useri).then(user => {
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
                    if(user.social.github != "" || user.social.github != undefined) gh = user.social.github;
                    if(user.social.youtube != "" || user.social.youtube != undefined) yt = user.social.youtube;
                    if(user.social.reddit != "" || !user.social.reddit != undefined) rd = user.social.reddit;
                    if(user.social.twitter != "" || user.social.twitter != undefined) tw = user.social.twitter;
                    if(user.social.instagram != "" || user.social.instagram != undefined) ig = user.social.instagram;
                } catch(err) {}
            }
            embed.setThumbnail(message.guild.members.get(useri).user.avatarURL);
            rp(`https://discordbots.org/user/${useri}`).then(body => {
                $ = cheerio.load(body);
                var boty = [];
                $('.bot-name').each((i, name) => {
                    boty.push(`${$(name).html()} <@${$(name).attr('id').replace("bot-", "")}>`);
                });
                embed.setDescription(`Użytkownik: **${user.username}#${user.discriminator}**\nID: **${user.id}**\nAdmin/Mod/Mod strony: **${user.admin}**`.replace("false", "nie").replace("true", "tak") + `/**${user.mod}**`.replace("false", "nie").replace("true", "tak") + `/**${user.webMod}**`.replace("false", "nie").replace("true", "tak") + `\nBio: **${bio}**\nKolor: ${color}\nGithub: **${gh}**\nYoutube: **${yt}**\nReddit: **${rd}**\nTwitter: **${tw}**\nInstagram: **${ig}**`);
                if(boty.length != 0) {
                    embed.addField("Boty:", boty.join(", "));
                }
                message.channel.send(embed);
            }).catch(err => {
                util.crash(message.channel, err, false);
            });
        }).catch(err => {
            if(err.status == 404) return message.channel.send("Nie znaleziono!");
            util.crash(message.channel, err, false);
        });
    }
}

module.exports.help = {
    name: "dbl",
    aliases: ["discordbotlist"],
    name2:"dbl <wzmianka/id>",
    desc:"Pokazuje informacje o użytkowniku/bocie z discordbots.org"
}