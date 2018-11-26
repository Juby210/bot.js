const Discord = require("discord.js");
const util = require("../../util/util");
let queuefile = require("./f/queue.js");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
    let queue = queuefile.getqueue;
    const player = client.player.get(message.guild.id);
    var vChannel = message.member.voiceChannel;
    const prefix = await db.getPrefix(message.guild.id);
    
    if(vChannel == null) {
        message.reply("najpierw wejdź na kanał głosowy!");
        return;
    }

    if (!player) {
        message.channel.send('Na kanale nie ma bota, dodaj go przez ${prefix}play');
        return;
    }

    const embed = new Discord.RichEmbed;
    embed.setColor("#0099FF");
    embed.setTitle(`<:mlist:488406259230310440> | Kolejka serwera ${message.guild.name}:`);
    embed.setDescription('Teraz gram: **' + queue[message.guild.id].song.title + "**")
    if (!player.playing) embed.setDescription('Teraz gram: **brak**');

    let nzm = 0;
    queue[message.guild.id].songs.forEach((song, i) => {
        if(i >= 10) return nzm++;
        let length = util.formatLength(song.length);
        embed.addField(`${i+1}. ${song.title}`, `Długość: ${length} | Dodano przez: ${song.requester}`);
    });
    if(nzm !== 0) embed.setFooter(`i ${nzm} więcej...`);

	message.channel.send(embed);
}

module.exports.help = {
    name:"queue",
    aliases: ["list", "q"],
    name2:"queue",
    desc:"Pokazuje kolejkę dla serwera"
}
