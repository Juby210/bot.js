const Discord = require("discord.js");
const config = require("../../config.json");
var playerf = require("./f/player.js");
var queuefile = require("./f/queue.js");
const snekfetch = require("snekfetch");
var db = require("../../util/db");

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);

    if(args[0] == null) {
        var embed = new Discord.RichEmbed();
        embed.setColor("#ffd700");
        embed.setTitle("Lista stacji radiowych:");
        var desc = "";
        config.radiolist.forEach(r => desc += `${r.id}. ${r.name}\n`);
        embed.setDescription(desc + `\n${prefix}radio <numer> - odtwórz radio\nUWAGA! Eska i Vox mogą czasem nie działać!`);
        embed.setFooter(`Brakuje stacji radiowych? Napisz do Juby210#5831`);
        message.channel.send(embed);
    } else {
        var radio = {};
        var zn = false;
        config.radiolist.forEach(r => {
            if(args[0] == r.id) {
                radio = r;
                zn = true;
            }
        });
        if(!zn) {
            message.channel.send("Nie znaleziono takiego numeru radia, wpisz `" + prefix + "radio` po listę stacji.");
            return;
        }
        var vChannel = message.member.voiceChannel;
        if(vChannel == null) {
            message.reply("najpierw wejdź na kanał głosowy!");
            return;
        }
        let queue = queuefile.getqueue;
        queue[message.guild.id].songs = [];
        message.channel.send("<:mplay:488399581470785557> | Odtwarzanie: `" + radio.name + "`");
        await getSong(radio.url, async s => {
            s.tracks.forEach(cos => {
                playerf.play(cos.track, client, message);
                queue[message.guild.id].playing = true;
                queuefile.song(message.guild.id, `Radio: ${radio.name}`, cos.info.author, cos.info.length, message.author.username, cos.info.uri, cos.track, Date.now());
            });
        });
    }
}

async function getSong(string, callback) {
    const res = await snekfetch.get(`http://${config.lavalink.host}:${config.lavalink.restport}/loadtracks?identifier=${string}`)
        .set("Authorization", config.lavalink.password)
        .catch(err => {
            console.error(err);
            return null;
        });
    if (!res) throw "There was an error, try again";
    callback(res.body);
}

module.exports.help = {
    name:"radio",
    name2:"radio [numer]",
    desc:"Bez numeru wyświetla listę stacji radiowych, z numerem odtwarza numer z listy"
}