const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;
var queuefile = require("./f/queue.js");
var index = require("../../index.js");

module.exports.run = async (client, message, args) => {
    const player = client.player.get(message.guild.id);
    if (!player) return message.reply("aktualnie nic nie gram");
    let queue = queuefile.getqueue;
    var song = queue[message.guild.id].song;
    var embed = new Discord.RichEmbed;
    embed.setAuthor("Odtwarzanie: ", client.user.avatarURL);
    embed.setTitle(song.title);
    var t1 = "00:00";
    var t2 = "00:00";
    formatlength(Date.now() - song.date, nt1 => t1 = nt1, false);
    formatlength(song.length, nt2 => t2 = nt2);
    embed.setDescription("`" + t1 + " / " + t2 + "`");
    embed.setFooter("Dodano przez: " + song.requester);
    message.channel.send(embed).then(async mes => {
        mes.react(index.emojiguild.emojis.get("488399581948936212")).then(() => mes.react(index.emojiguild.emojis.get("488399581965451265")));
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

function formatlength(ms, callback, replace = true) {
    var h = Math.floor(ms / 1000 / 60 / 60);
    var min = Math.floor(ms / 1000 / 60 - h * 60);
    var sec = Math.floor(ms / 1000 - min * 60);
    
    var uh = false;
    if (!h == 0) {uh = true; if(h <= 9) {h = "0" + h;}}
    if (min <= 9) min = "0" + min;
    if (sec <= 9) sec = "0" + sec;
    var time = "";
    if(uh) {if(h >= 200) {time = "LIVE";} else {time = `${h}:${min}:${sec}`;}} else {time = `${min}:${sec}`;}
    if(replace) {
        if(time == "00:00") {callback("LIVE"); return;}
    }
    callback(time);
}

module.exports.help = {
    name:"np",
    category:"MUZYKA",
    aliases:"nowplaying"
}