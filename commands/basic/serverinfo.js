const Discord = require("discord.js");

module.exports.run = async (client, message, guild) => {
    var guild = message.guild;
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(guild.id);
    const verificationLevels = [strings.getMsg("v_none"), strings.getMsg("v_low"), strings.getMsg("v_medium"), strings.getMsg("v_crazy"), strings.getMsg("v_extreme")];
    const textChannels = guild.channels.filter(c => c.type === 'text');
    const voiceChannels = guild.channels.filter(c => c.type === 'voice');
    var online = guild.members.filter(m => m.user.presence.status === "online").size
    var dnd = guild.members.filter(m => m.user.presence.status === "dnd").size
    var offline = guild.members.filter(m => m.user.presence.status === "offline").size
    var bots = guild.members.filter(m => m.user.bot).size
    var roleList = guild.roles.sort((a, b) => a.position - b.position).map(role => role.toString()).slice(1).reverse().join(",")

    let icon = guild.iconURL;
    let embed = new Discord.RichEmbed()
    embed.setAuthor(`ServerInfo - ${guild.name}`, client.user.avatarURL);
    embed.setThumbnail(icon);
    embed.addField(`${strings.getMsg("users")} [${guild.memberCount}]:`, `Online: ${online}\n${strings.getMsg("s_dnd")}: ${dnd}\n${strings.getMsg("s_offline")}: ${offline}\n${strings.getMsg("bots")}: ${bots}`);
    embed.addField(`${strings.getMsg("channels")} [${guild.channels.size}]:`, `${strings.getMsg("voice_channels")}: ${voiceChannels.size}\n ${strings.getMsg("text_channels")}: ${textChannels.size}`);
    embed.addField(`${strings.getMsg("roles")} [${guild.roles.size}]:`, roleList);
    embed.addField(`${strings.getMsg("verification")}:`, verificationLevels[guild.verificationLevel]);
    embed.addField(`${strings.getMsg("region")}:`, guild.region);
    embed.addField(`${strings.getMsg("owner")}:`, guild.owner);
    embed.addField(`${strings.getMsg("created")}:`, guild.createdAt);
    embed.setFooter("© Juby210 & hamster" + " | " + "ID: " + guild.id, client.user.avatarURL);
    embed.setTimestamp();
    message.channel.send(embed);
}

module.exports.help = {
  name:"serverinfo",
  name2:"serverinfo",
  desc:"Wyświetla informacje o serwerze"
}