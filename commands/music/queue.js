const Discord = require("discord.js");
const util = require("../../util/util");
let queuefile = require("./f/queue.js");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    let queue = queuefile.getqueue;
    const player = client.player.get(message.guild.id);
    const prefix = await db.getPrefix(message.guild.id);

    if (!player) {
        message.channel.send(`${strings.getMsg("music_playernull")}`);
        return;
    }

    const embed = new Discord.RichEmbed;
    embed.setColor("#0099FF");
    embed.setTitle("<:mlist:488406259230310440> | " + `${strings.getMsg("music_queue_title").replace("#GUILD#", message.channel.guild)}`);
    embed.setDescription(`${strings.getMsg("music_queue_playing").replace("#SONG#", queue[message.guild.id].song.title)}`)
    if (!player.playing) embed.setDescription(`${strings.getMsg("music_queue_playingnull")}`);

    let nzm = 0;
    queue[message.guild.id].songs.forEach((song, i) => {
        if(i >= 10) return nzm++;
        let length = util.formatLength(song.length);
        embed.addField(`${i+1}. ${song.title}`, `${strings.getMsg("music_queue_list").replace("#TIME#", util.formatLength(song.length)).replace("#REQUESTER#", song.requester)}`);
    });
    if(nzm !== 0) embed.setFooter(`${stings.getMsg("music_queue_footer").replace("#NUM#", nzm)}`);

	message.channel.send(embed);
}

module.exports.help = {
    name:"queue",
    aliases: ["list", "q"],
    name2:"queue",
    desc:"Pokazuje kolejkę dla serwera"
}
