const Discord = require("discord.js");
const util = require("../../util/util");
var queuefile = require("./f/queue.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    let emojiguild = client.guilds.get("488293188247879680");
    const player = client.player.get(message.guild.id);
    if (!player) return message.reply(`${strings.getMsg("music_nonp")}`);
    if (!player.playing) return message.reply(`${strings.getMsg("music_nonp")}`);
    let queue = queuefile.getqueue;
    let song = queue[message.guild.id].song;
    let embed = new Discord.RichEmbed;
    embed.setAuthor(`${strings.getMsg("music_nptitle")}`, client.user.avatarURL);
    embed.setTitle(song.title);
    let t1 = util.formatLength(Date.now() - song.date, false);
    let t2 = util.formatLength(song.length);
    embed.setDescription(`\`${t1} / ${t2}\`\n[Link](${song.url})`);
    if(queuefile.paused(message.guild.id)) embed.setDescription(`\`Pauza / ${t2}\`\n${`[Link](${song.url})`}`);
    if(song.url.startsWith("https://www.youtube.com/")) {
        let id = song.url.replace("https://www.youtube.com/watch?v=", "");
        embed.setThumbnail(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    }
    embed.setFooter("Dodano przez: " + song.requester);
    message.channel.send(embed).then(async mes => {
        mes.react(emojiguild.emojis.get("488399581948936212")).then(() => mes.react(emojiguild.emojis.get("488399581965451265")));
        const col = mes.createReactionCollector((rea, user) => user.id == message.author.id);
        col.on("collect", async (rea, user) => {
            switch (rea.emoji.id) {
                case "488399581948936212":
                    if(!player.paused) {
                        await player.pause(true);
                        queuefile.pause(message.guild.id);
                    } else {
                        await player.pause(false);
                        queuefile.pause(message.guild.id, false);
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