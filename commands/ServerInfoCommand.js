const Discord = require("discord.js");

module.exports.run = async (client, message, guild) => {
    function checkBots(guild) {
        let botCount = 0;
        guild.members.forEach(member => {
          if(member.user.bot) botCount++;
        });
        return botCount;
      }

    const verificationLevels = ['Brak [None]', 'Niski [Low] (Zweryfikowany Email)', 'Średni [Medium] (Zarejestrowany na discordzie przez 5+ minut)', 'Szalony [Insane] (Zarejestrowany na discordzie przez 10+ minut)', 'Skrajny [Extreme] (Zweryfikowany numer telefonu)'];

    let icon = message.guild.iconURL;
    let embed = new Discord.RichEmbed()
    embed.setAuthor(`ServerInfo - ${message.guild.name}`, client.user.avatarURL);
    embed.setThumbnail(icon);
    embed.addField("Użytkowników: ", message.guild.memberCount + " (w tym botów: " + checkBots(message.guild) + ")");
    embed.addField("Kanałów: [" + message.guild.channels.size + "]", message.guild.channels.filter(m => m.type === 'voice').size + " - Głosowych\n" + message.guild.channels.filter(m => m.type === 'text').size + " - Textowych");
    embed.addField("Role: [" + message.guild.roles.size + "]", message.guild.roles.sort((a, b) => a.position - b.position).map(role => role.toString()).slice(1).reverse().join(", "));
    embed.addField("Weryfikacja:", verificationLevels[message.guild.verificationLevel]);
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