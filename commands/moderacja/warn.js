const Discord = require("discord.js");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    if(message.member.hasPermission("BAN_MEMBERS") == true) {
        if(args[0] == null) {
            message.reply("Podaj użytkownika do ostrzeżenia!");
            message.react("❌");
        } else {
            let msg = message.content.trim().split('|');
            if (!msg[1]) msg[1] = 'Brak powodu.';
            await db.warn(message.mentions.users.first().id, guildID, args[2], msg[1]);

            let ok = `{user} został ostrzeżony(a) z powodem: {reason}\nNadane przez: **{user1}**`

            ok = ok.replace('{user}', message.mentions.users.first()).replace('{reason}', msg[1]).replace('{user1}', message.author.tag);
            
            const embed = new Discord.RichEmbed();
            embed.setAuthor("Ostrzeżenie | Warn");
            embed.setDescription(ok);
            embed.setColor('#D5BEC6');
            embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
            embed.setTimestamp()
            message.channel.send(embed);
        }
    } else {
        message.reply("Brak uprawnień!");
        message.react("❌");
    }
}

module.exports.help = {
    name:"warn",
}