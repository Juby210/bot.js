const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    var embed = new Discord.RichEmbed();
    embed.setColor("#ffd700");
    embed.setTitle(`${strings.getMsg("botcode")}:`);
    embed.setDescription("https://github.com/juby210-PL/bot.js");
    message.channel.send(embed);
}

module.exports.help = {
    name: "github",
    aliases: ["kod"],
    name2:"github",
    desc:"Link do kodu bota na githubie"
}