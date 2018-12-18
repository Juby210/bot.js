const Discord = require("discord.js");
const dateFormat = require('dateformat');
const util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    var gra = "Użytkownik w nic nie gra."
    var stream = false;
    util.searchUser(message, args[0]).then(member => {
        let member2 = message.guild.member(member);

        try {
            gra = member.presence.game.name;
            stream = member.presence.game.streaming;
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
        embed.addField(`${strings.getMsg("nickname")}:`, pseudo, true);
        embed.addField(`${strings.getMsg("game")}:`, gra);
        embed.addField("ID:", member.id, true);
        embed.addField("Status:", member.presence.status, true);
        embed.addField(strings.getMsg("acc_created"), dateFormat(member.createdAt, "yyyy-mm-dd HH:mm:ss"), true);
        embed.addField(strings.getMsg("joined"), dateFormat(member2.joinedAt, "yyyy-mm-dd HH:mm:ss"), true);
        embed.addField(`${strings.getMsg("roles")} [${member2.roles.size - 1}]:`, role, true);
        embed.setThumbnail(member.avatarURL);
        embed.setFooter(message.author.tag + " (" + message.author.id + ")", client.user.avatarURL);
        embed.setTimestamp();
        message.channel.send(embed);
    });
}

module.exports.help = {
    name:"userinfo"
}