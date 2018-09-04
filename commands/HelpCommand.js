const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
let strona = ("https://botjs.juby.cf/");
let github = ("https://github.com/Juby210-PL/bot.js");

module.exports.run = async (client, message, args) => {
    var embed = new Discord.RichEmbed;
    embed.setAuthor(`${client.user.username} - Prefix: ${prefix}`, client.user.avatarURL);
    embed.setColor("#0099FF");
    embed.addField("BASIC (4)", "``avatar, help, userinfo, info``", true);
    embed.addField("MODERACJA (9)", "``ban, kick, nick, renameall, rename, resetall, voicekick, voiceunban, voiceban``", true);
    embed.addField("WEB (3)", "``dbl, shorten, urls``", true);
    embed.addField("MISC (3)", "``uptime, github, invite``", true);
    embed.addField("MUZYKA (11)", "``play, pause, skip, join, leave, resume, vol, np, clearqueue, search, q``", true);
    embed.addField("Informacje o komendzie:", `${prefix}info <komenda>`);
    embed.addBlankField();
    embed.addField("🔗 Przydatne linki:\n", "[[WWW]](" + strona + ")" + "\n" + "[[GitHub]](" + github + ")", true);
    embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
    embed.setTimestamp()
    message.channel.send(embed);
}

module.exports.help = {
  name:"help"
}
