const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    var guild = message.guild;
    let icon = guild.iconURL;
    let emoji = message.content.split(/\s+/g).slice(1).join(" ");
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(guild.id);

    if (!emoji) {
        const emojis = message.guild.emojis;
        if (!emojis.size) return message.channel.send(strings.getMsg("noemojis"));

        var embed = new Discord.RichEmbed;
        embed.setAuthor(`${strings.getMsg("emotesin")} ${message.guild.name} [${emojis.size}]`, icon);
        embed.setDescription(emojis.map(emoji => emoji.toString()).join(' '), { split: { char: ' ' } });
        embed.setColor('#A5A3BB');
        return message.channel.send(embed);

    } else {
        if (!args[0].startsWith('<')) return message.channel.send(strings.getMsg("notcorrectemoji"));
        let id = args[0].substring(args[0].lastIndexOf(':') + 1, args[0].lastIndexOf('>'));

        let emoteInfo = client.emojis.get(id);
        if (!emoteInfo) return message.channel.send(strings.getMsg("notcorrectemoji"));

        var embed = new Discord.RichEmbed;
        embed.setDescription(`<:mlist:488406259230310440> | ${strings.getMsg("emoteinfo")}\n**${strings.getMsg("name")}**: :${emoteInfo.name}:\n**ID**: ${emoteInfo.id}\n**${strings.getMsg("server")}**: ${emoteInfo.guild}\n[[${strings.getMsg("emote_directlink")}]](${emoteInfo.url})`);
        embed.setThumbnail(emoteInfo.url);
        embed.setColor('#D5BEC6');
        embed.setFooter(`${strings.getMsg("requestedby")} ${message.author.tag} (${message.author.id})`, client.user.avatarURL);
        embed.setTimestamp()   
        return message.channel.send(embed);
    }
}

module.exports.help = {
    name: "emoji",
    name2: "emoji [:emotka:]",
    desc: "Wyświetla wszystkie emoji z serwera lub informacje o podanej emotce"
}