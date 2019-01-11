const Discord = require("discord.js");
const dateFormat = require('dateformat');
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "userinfo"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        var gra = "none";
        util.searchUser(a.message, a.args[0]).then(member => {
            let member2 = a.message.guild.member(member);

            try {
                gra = member.presence.game.name;
            } catch(err) {}
            var role = "";
            member2.roles.forEach(r => {
                if(r.name == "@everyone") return;
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
            embed.addField("Username:", member.username, true);
            embed.addField("Tag:", "#" + member.discriminator, true);
            embed.addField(`${a.strings.getMsg("nickname")}:`, pseudo, true);
            embed.addField(`${a.strings.getMsg("game")}:`, gra);
            embed.addField("ID:", member.id, true);
            embed.addField("Status:", member.presence.status, true);
            embed.addField(a.strings.getMsg("acc_created"), dateFormat(member.createdAt, "yyyy-mm-dd HH:mm:ss"), true);
            embed.addField(a.strings.getMsg("joined"), dateFormat(member2.joinedAt, "yyyy-mm-dd HH:mm:ss"), true);
            embed.addField(`${a.strings.getMsg("roles")} [${member2.roles.size - 1}]:`, role, true);
            embed.setThumbnail(member.avatarURL);
            embed.setFooter(a.message.author.tag + " (" + a.message.author.id + ")", client.user.avatarURL);
            embed.setTimestamp();
            a.message.channel.send(embed);
        });
    }
}