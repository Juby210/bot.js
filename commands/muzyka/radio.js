const Discord = require("discord.js");
const config = require("../../config.json");
var playerf = require("./f/player.js");
var queuefile = require("./f/queue.js");
const snekfetch = require("snekfetch");
var db = require("../../util/db");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
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
        embed.setTitle(`${strings.getMsg("music_radio_title")}`);
        var desc = "";
        config.radiolist.forEach(r => desc += `${r.id}. ${r.name}\n`);
        embed.setDescription(desc + `${strings.getMsg("music_radio_desc").replace("#PREFIX#", prefix)}`);
        embed.setFooter(`${strings.getMsg("music_radio_footer")}`);
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
            message.channel.send(`${strings.getMsg("music_radio_notfound").replace("#PREFIX#", prefix)}`);
            return;
        }
        var vChannel = message.member.voiceChannel;
        if(vChannel == null) {
            message.reply(`${strings.getMsg("music_join")}`);
            return;
        }
        let queue = queuefile.getqueue;
        queue[message.guild.id].songs = [];
        message.channel.send("<:mplay:488399581470785557> | " + `${strings.getMsg("music_radio_play").replace("#RADIO#", radio.name)}`);
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