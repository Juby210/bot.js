const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    var guild = message.guild
    let icon = guild.iconURL;
    let emoji = message.content.split(/\s+/g).slice(1).join(" ");

    if (!emoji) {
        const emojis = message.guild.emojis
        if (!emojis.size) return message.channel.send('Ten serwer nie posiada żadnych emotek!');

        var embed = new Discord.RichEmbed;
        embed.setAuthor(`Emotki w: ${message.guild.name} [${emojis.size}]`, icon);
        embed.setDescription(emojis.map(emoji => emoji.toString()).join(' '), { split: { char: ' ' } });
        embed.setColor('#A5A3BB');
        return message.channel.send(`Tutaj wszystkie emotki tego serwera!`, embed);

    } else {
        const args = message.content.split(" ");

        if (!args[1].startsWith('<')) return message.channel.send('To nie jest właściwa emotka!');
        let id = args[1].substring(args[1].lastIndexOf(':') + 1, args[1].lastIndexOf('>'));

        let emoteInfo = client.emojis.get(id);
        if (!emoteInfo) return message.channel.send('To nie jest właściwa emotka!');

        var embed = new Discord.RichEmbed;
        embed.setDescription("<:mlist:488406259230310440> | Informacje o emotce:\n**Nazwa**: :" + emoteInfo.name + ":\n**ID**: " + emoteInfo.id + "\n**Serwer**:" + emoteInfo.guild + "\n" + "[[Bezpośredni link do emotki]]" + "(" + emoteInfo.url + ")");
        embed.setThumbnail(emoteInfo.url);
        embed.setColor('#D5BEC6');
        embed.setFooter("Wykonane przez: " + message.author.tag + " (" + message.author.id + ")", client.user.avatarURL);
        embed.setTimestamp()   
        return message.channel.send(embed);
    }
}

module.exports.help = {
    name: "emoji",
    name2: "emoji [:emotka:]",
    desc: "Wyświetla wszystkie emoji z serwera lub informacje o podanej emotce"
}