const Discord = require("discord.js");
const Jimp = require("jimp");
const fs = require("fs");
const dateFormat = require('dateformat');

module.exports.run = (client, message, args) => {
    var gra = "brak"
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
    var pseudo = member2.nickname;
    if(pseudo == null) {pseudo = member.username;}
    Jimp.read("img/userinfo.png").then(img => {
        Jimp.read(member.avatarURL).then(imgg => {
            imgg.resize(156, 156);
            img.composite(imgg, 15, 15);
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font32 => {
                Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(font16 => {
                    Jimp.loadFont("img/sans.fnt").then(font20 => {
                        Jimp.loadFont("img/sansbold.fnt").then(font20B => {
                            img.print(font32, 190, 20, member.tag);
                            if(pseudo != member.username) img.print(font16, 190, 7, `(${pseudo})`);
                            var wgr = "W grze";
                            if(stream) wgr = "Streamuje";
                            if(gra == "Spotify") wgr = "Słucha";
                            img.print(font20, 190, 54, wgr);
                            var ee = Jimp.measureText(font20, wgr) + 195;
                            img.print(font20B, ee, 54, gra);
                            img.print(font20, 190, 150, member.presence.status);
                            img.print(font20B, 10, 180, `ID:`);
                            var eee = Jimp.measureText(font20B, "ID:") + 15;
                            img.print(font20, eee, 180, member.id);
                            img.print(font20B, 10, 215, "Konto stworzone:");
                            img.print(font20, 10, 238, dateFormat(member.createdAt, "yyyy-mm-dd HH:mm:ss"));
                            img.print(font20B, 10, 261, "Na serwerze od:");
                            img.print(font20, 10, 284, dateFormat(member2.joinedAt, "yyyy-mm-dd HH:mm:ss"));

                            img.print(font20B, 10, 319, "Role [" + (member2.roles.size - 1) + "]:");
                            var role = 10;
                            var y = 342;
                            member2.roles.forEach(r => {
                                if(r.name == "@everyone") return;
                                if (role == 10) {
                                    img.print(font20, role, y, r.name);
                                    role += Jimp.measureText(font20, r.name);
                                } else {
                                    if(role + Jimp.measureText(font20, ", " + r.name) >= 510) {
                                        y += 23;
                                        role = 10;
                                        img.print(font20, role, y, r.name);
                                        role += Jimp.measureText(font20, r.name);
                                    } else {
                                        img.print(font20, role, y, ", " + r.name);
                                        role += Jimp.measureText(font20, ", " + r.name);
                                    }
                                }
                            });

                            let r = Math.random().toString(36).substring(7) + ".png";
                            img.write(`img/${r}`);
                            message.channel.send({files: [{
                                attachment: `img/${r}`,
                                name: "userinfo.png"
                            }]}).then(() => {try{fs.unlink(`img/${r}`)} catch(e) {}}).catch(err => require("../../util/util").crash(message.channel, err));
                        });
                    });
                });
            });
        });
    });
}

module.exports.help = {
    name:"userinfo",
    name2:"userinfo [wzmianka/nazwa]",
    desc: "Wyświetla informacje o użytkowniku"
}