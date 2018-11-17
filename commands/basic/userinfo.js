const Discord = require("discord.js");
const Jimp = require("jimp");
const fs = require("fs");
const dateFormat = require('dateformat');
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    let gra;
    let stream = false;
    util.searchUser(message, args[0]).then(member => {
        let member2 = message.guild.member(member);
        try {
            gra = member.presence.game.name;
            stream = member.presence.game.streaming;
        } catch(err) {}
        let pseudo = member2.nickname;
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
                                if(gra) {
                                    let wgr = strings.getMsg("playing");
                                    if(stream) wgr = strings.getMsg("streaming");
                                    if(gra == "Spotify") wgr = strings.getMsg("listening");
                                    img.print(font20, 190, 54, wgr);
                                    let ee = Jimp.measureText(font20, wgr) + 195;
                                    img.print(font20B, ee, 54, gra);
                                }
                                img.print(font20, 190, 150, member.presence.status);
                                img.print(font20B, 10, 180, `ID:`);
                                let eee = Jimp.measureText(font20B, "ID:") + 15;
                                img.print(font20, eee, 180, member.id);
                                img.print(font20B, 10, 215, strings.getMsg("acc_created"));
                                img.print(font20, 10, 238, dateFormat(member.createdAt, "yyyy-mm-dd HH:mm:ss"));
                                img.print(font20B, 10, 261, strings.getMsg("joined"));
                                img.print(font20, 10, 284, dateFormat(member2.joinedAt, "yyyy-mm-dd HH:mm:ss"));
    
                                img.print(font20B, 10, 319, `${strings.getMsg("roles")} [${member2.roles.size - 1}]:`);
                                let role = 10;
                                let y = 342;
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
                                }]}).then(() => {try{fs.unlink(`img/${r}`)} catch(e) {}}).catch(err => util.crash(message.channel, err));
                            });
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