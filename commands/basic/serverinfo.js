const Discord = require("discord.js");

module.exports.run = async (client, message, guild) => {
    var guild = message.guild
    const verificationLevels = ['Brak [None]', 'Niski [Low] (Zweryfikowany Email)', 'Średni [Medium] (Zarejestrowany na discordzie przez 5+ minut)', 'Szalony [Insane] (Zarejestrowany na discordzie przez 10+ minut)', 'Skrajny [Extreme] (Zweryfikowany numer telefonu)'];
    const textChannels = guild.channels.filter(c => c.type === 'text');
    const voiceChannels = guild.channels.filter(c => c.type === 'voice');
    var online = guild.members.filter(m => m.user.presence.status === "online").size
    var idle = guild.members.filter(m => m.user.presence.status === "idle").size
    var dnd = guild.members.filter(m => m.user.presence.status === "dnd").size
    var offline = guild.members.filter(m => m.user.presence.status === "offline").size
    var bots = guild.members.filter(m => m.user.bot).size
    var roleList = guild.roles.sort((a, b) => a.position - b.position).map(role => role.toString()).slice(1).reverse().join(",")

    let icon = guild.iconURL;
    let embed = new Discord.RichEmbed()
    embed.setAuthor(`ServerInfo - ${guild.name}`, client.user.avatarURL);
    embed.setThumbnail(icon);
    embed.addField("Użytkowników [" + guild.memberCount + "]:", "Online: " + online + "\nZaraz Wracających (Idle): " + idle + "\nZajętych (Do not Distrub): " + dnd + "\nNiedostępnych (Offline): " + offline + "\nBoty: " + bots);
    embed.addField("Kanałów [" + guild.channels.size + "]:", voiceChannels.size + " - Kanałów głosowych\n" + textChannels.size + " - Kanałów textowych");
    embed.addField("Role [" + guild.roles.size + "]:", roleList);
    embed.addField("Weryfikacja:", verificationLevels[guild.verificationLevel]);
    embed.addField("Region:", guild.region);
    embed.addField("Właściciel:", guild.owner);
    embed.addField("Stworzony:", guild.createdAt);
    embed.setFooter("© Juby210 & hamster" + " | " +"ID: " + guild.id, client.user.avatarURL);
    embed.setTimestamp();

    message.channel.send(embed);
}

module.exports.help = {
  name:"serverinfo",
  name2:"serverinfo",
  desc:"Wyświetla informacje o serwerze"
}