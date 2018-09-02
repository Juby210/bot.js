const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    var embed = new Discord.RichEmbed;
    embed.setAuthor(`${client.user.username} - Prefix: ${prefix}`, client.user.avatarURL);
    embed.setColor("#0099FF");
    embed.setTitle(`${prefix}help`);
    embed.setDescription("Lista komend bota: \n`userinfo, ban, kick, resetall, renameall, rename, voicekick, voiceban, voiceunban, uptime, github, invite, botinfo, dbl, shorten, urls`");
    embed.addField("FUNKCJE BETA: \nBot muzyczny:", "`play, search, q, clearqueue, leave, join`");
    embed.addField("Komendy działające tylko jak bot gra:", "`pause, resume, skip, vol, np`");
    embed.addBlankField();
    embed.addField("Po więcej info o komendach wpisz:", `${prefix}info <komenda>`);
    embed.setFooter(client.user.avatarURL, "© Juby210");
    embed.setTimestamp()
    message.channel.send(embed);
}

module.exports.help = {
  name:"help"
}