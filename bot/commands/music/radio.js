const Discord = require("discord.js");
const player = require("./f/player");
const config = require("../../../config.json");
const rp = require("request-promise");
const rm = require("discord.js-reaction-menu");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "radio"
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
            let pages = [];
            let desc = "";
            let pg = 1;
            let ii = 25;
            stations.forEach((s, i) => {
                desc += `${i+config.radiolist.length+1}. ${s.name}\n`;
                if(i >= ii) {
                    ii += 25;
                    pg += 1;
                    desc += '\n' + a.strings.getMsg("music_radio_desc").replace(/#PREFIX#/g, a.prefix).split('\n')[1];
                    pages.push(new Discord.RichEmbed({color: parseInt("ffd700", 16), title: a.strings.getMsg("music_radio_title"), description: desc, footer: {text: `${pg-1}/${Math.ceil(stations.length/25)}`}}));
                    desc = '';
                }
            });
            if(desc != '') {
                pg += 1;
                desc += '\n' + a.strings.getMsg("music_radio_desc").replace(/#PREFIX#/g, a.prefix).split('\n')[1];
                pages.push(new Discord.RichEmbed({color: parseInt("ffd700", 16), title: a.strings.getMsg("music_radio_title"), description: desc, footer: {text: `${pg-1}/${Math.ceil(stations.length/25)}`}}));
            }
            new rm.menu(a.message.channel, a.message.author.id, pages);
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