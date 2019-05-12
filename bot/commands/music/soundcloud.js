const player = require("./f/player");
const Discord = require("discord.js");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "soundcloud",
            aliases: ["sc"],
            reqVC: true
        });
        this.run = this.r;
        this.play = this.play;
    }
    async r(a = {}) {
        if(!a.args[0]) return cmd.error(a, a.strings.getMsg("music_search_null"));

        let text = a.args.join(" ");
        await player.getSong(`scsearch:${text}`).then(async songs => {
            if(songs.loadType == "NO_MATCHES") return cmd.error(a, a.strings.getMsg("music_search_notfound"));

            let eb = new Discord.RichEmbed();
            eb.setColor("#FFAA");
            eb.setTitle(a.strings.getMsg("music_search_title"));
            eb.setDescription(a.strings.getMsg("music_search_success"));
            songs.tracks.forEach((s, i) => {
                if(i >= 10) return;
                eb.addField(i+1 + ". " + s.info.title, a.strings.getMsg("music_search_channel") + " " + s.info.author);
            });
            eb.setFooter(a.strings.getMsg("music_search_time"));
            let msearch;
            a.message.channel.send(eb).then(mes => msearch = mes);

            let collector = a.message.channel.createMessageCollector(m => m.author = a.message.author, {time: 30000});
            collector.on("collect", async m => {
                if(m.content.toLowerCase().startsWith(a.strings.getMsg("music_search_cancel"))) {
                    collector.stop();
                    return cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.done)} | ${global.up(this.name)}\n${a.strings.getMsg("music_search_exit")}`);
                }
                
                songs.tracks.forEach(async (s, i) => {
                    if(i >= 10) return;
                    if(Number(m.content) == i+1) {
                        await this.play(s, a);
                        collector.stop();
                    }
                });
            });
            collector.on("end", () => {
                msearch.delete();
            });
        });
    }
    async play(song, a) {
        if(!song) return cmd.error(a, a.strings.getMsg("music_nofound"));
        let s = {title: song.info.title.replace(/`/g, "'"), channel: song.info.author, length: song.info.length, requester: a.message.author.tag, url: song.info.uri, track: song.track};
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