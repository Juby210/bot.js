const Discord = require("discord.js");
const util = require("../../util/util");
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    var emojiguild = client.guilds.get("488293188247879680");
    const player = client.player.get(message.guild.id);
    if (!player) return message.reply("aktualnie nic nie gram");
    if (!player.playing) return message.reply("aktualnie nic nie gram");
    let queue = queuefile.getqueue;
    var song = queue[message.guild.id].song;
    var embed = new Discord.RichEmbed;
    embed.setAuthor("Odtwarzanie: ", client.user.avatarURL);
    embed.setTitle(song.title);
    var t1 = util.formatLength(Date.now() - song.date, false);
    var t2 = util.formatLength(song.length);
    embed.setDescription("`" + t1 + " / " + t2 + "`\n" + `[Link](${song.url})`);
    if(song.url.startsWith("https://www.youtube.com/")) {
        var id = song.url.replace("https://www.youtube.com/watch?v=", "");
        embed.setThumbnail(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    }
    embed.setFooter("Dodano przez: " + song.requester);
    message.channel.send(embed).then(async mes => {
        mes.react(emojiguild.emojis.get("488399581948936212")).then(() => mes.react(emojiguild.emojis.get("488399581965451265")));
        var col = mes.createReactionCollector((rea, user) => user.id == message.author.id);
        col.on("collect", async (rea, user) => {
            switch (rea.emoji.id) {
                case "488399581948936212":
                    if(!player.paused) {
                        await player.pause(true);
                    } else {
                        await player.pause(false);
                    }
                    break;
                case "488399581965451265":
                    await player.stop();
                    break;
            }
        });
    });
}

module.exports.help = {
    name:"np",
    aliases:["nowplaying"],
    name2:"np",
    desc:"Pokazuje co aktualnie jest odtwarzane"
}