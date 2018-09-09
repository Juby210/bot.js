const Discord = require("discord.js");

module.exports.run = async (client, message, guild) => {
    function checkBots(guild) {
        let botCount = 0;
        guild.members.forEach(member => {
          if(member.user.bot) botCount++;
        });
        return botCount;
      }

    let icon = message.guild.iconURL;
    let embed = new Discord.RichEmbed()
    embed.setAuthor(`ServerInfo - ${message.guild.name}`, client.user.avatarURL);
    embed.setThumbnail(icon);
    embed.addField("Użytkowników: ", message.guild.memberCount + " (w tym botów: " + checkBots(message.guild) + ")");
    embed.addField("Kanałów: [" + message.guild.channels.size + "]", "#niedługo-spis");
    embed.addField("Role: [" + message.guild.roles.size + "]", "#niedługo-spis");
    embed.addField("Weryfikacja:", message.guild.verificationLevel);
    embed.addField("Region:", message.guild.region);
    embed.addField("Właściciel:", message.guild.owner);
    embed.addField("Stworzony:", message.guild.createdAt);
    embed.setFooter("ID: " + message.guild.id)

    message.channel.send(embed);
}

module.exports.help = {
  name:"serverinfo",
  category: "BASIC"
}