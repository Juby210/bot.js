const Discord = require("discord.js");
const player = require("./f/player");
const config = require("../../../config.json");
const rp = require("request-promise");
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
            embed.setDescription(desc + a.strings.getMsg("music_radio_desc").replace(/#PREFIX#/g, a.prefix));
            embed.setFooter(a.strings.getMsg("music_radio_footer"));
            a.message.channel.send(embed);
        } else if (a.args[0] == "eska") {
            const stations = JSON.parse(await rp('https://juby.tk/stacje.json'));
            let embed = new Discord.RichEmbed();
            embed.setColor("#ffd700");
            embed.setTitle(a.strings.getMsg("music_radio_title"));
            let desc = "";
            let pg = 0;
            stations.forEach((s, i) => {
                if(!a.args[1] || a.args[1] == '1') {
                    if(i >= 25) return;
                    pg = 1;
                    desc += `${i+config.radiolist.length+1}. ${s.name}\n`;
                } else if (a.args[1] == '2') {
                    if(i <= 24 || i >= 50) return;
                    pg = 2;
                    desc += `${i+config.radiolist.length+1}. ${s.name}\n`;
                } else if (a.args[1] == '3') {
                    if(i <= 49 || i >= 75) return;
                    pg = 3;
                    desc += `${i+config.radiolist.length+1}. ${s.name}\n`;
                } else {
                    if(i <= 74) return;
                    pg = 4;
                    desc += `${i+config.radiolist.length+1}. ${s.name}\n`;
                }
            });
            embed.setDescription(desc + '\n' + a.strings.getMsg("music_radio_desc").replace(/#PREFIX#/g, a.prefix).split('\n')[1]);
            embed.setFooter(`${pg}/4 | ${a.prefix}radio eska 1/2/3/4`);
            a.message.channel.send(embed);
        } else {
            let stations = config.radiolist;
            if(a.args[0] >= config.radiolist.length) stations = JSON.parse(await rp('https://juby.tk/stacje.json'));
            let radio = stations[a.args[0]-config.radiolist.length-1];
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