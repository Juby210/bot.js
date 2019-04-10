const Discord = require("discord.js");
const player = require("./f/player");
const qc = require("./f/queue");
const config = require("../../../config.json");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "radio",
            reqVC: true
        });
        this.run = this.r;
        this.play = this.play;
    }
    async r(a = {}) {
        if(!a.args[0]) {
            let embed = new Discord.RichEmbed();
            embed.setColor("#ffd700");
            embed.setTitle(a.strings.getMsg("music_radio_title"));
            let desc = "";
            config.radiolist.forEach((r, i) => desc += `${i+1}. ${r.name}\n`);
            embed.setDescription(desc + a.strings.getMsg("music_radio_desc").replace("#PREFIX#", a.prefix));
            embed.setFooter(a.strings.getMsg("music_radio_footer"));
            a.message.channel.send(embed);
        } else {
            let radio = config.radiolist[a.args[0]-1];
            if(!radio) return cmd.error(a, a.strings.getMsg("music_radio_notfound").replace("#PREFIX#", a.prefix));
            await player.getSong(radio.url).then(async r => {
                r.tracks.forEach(async song => {
                    await this.play(song, radio, a);
                });
            });
        }
    }
    async play(song, radio, a) {
        if(!song) return cmd.error(a, a.strings.getMsg("music_nofound"));
        let s = {title: `Radio: ${radio.name}`, channel: song.info.author, length: song.info.length, requester: a.message.author.tag, url: song.info.uri, track: song.track};
        player.play(s, a.client, a.message).then(t => {
            if(t == "play") {
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["play"])} | ${global.up(this.name)}\n${a.strings.getMsg("music_playing_play").replace("#SONG#", s.title).replace("#CHANNEL#", s.channel)}`);
            } else if (t == "queue") {
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["plus"])} | ${global.up(this.name)}\n${a.strings.getMsg("music_added").replace("#SONG#", s.title).replace("#CHANNEL#", s.channel)}`);
            } else {
                cmd.error(a, a.strings.getMsg("music_permerror"))
            }
        });
    }
}