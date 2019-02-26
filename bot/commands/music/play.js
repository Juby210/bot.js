const player = require("./f/player");
const qc = require("./f/queue");
const config = require("../../../config.json");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "play",
            aliases: [">", "p"],
            reqVC: true
        });
        this.run = this.r;
        this.play = this.play;
    }
    async r(a = {}) {
        const vChannel = a.message.member.voiceChannel;
        if(!a.args[0]) return cmd.error(a, a.strings.getMsg("music_play_link"));

        let track = a.args.join(" ");
        let ok = false;
        await player.getSong(track).then(async s => {
            if(ok) return;
            if(s.loadType == "NO_MATCHES") {
                await player.getSong(`ytsearch:${track}`).then(async songs => {
                    if(songs.loadType == "NO_MATCHES") {
                        return cmd.error(a, a.strings.getMsg("music_nofound"));
                    } else {
                        await this.play(songs.tracks[0], a);
                    }
                });
            } else if (s.loadType == "PLAYLIST_LOADED") {
                if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
                let queue = a.client.queue[a.message.guild.id];
                let c = 0;
                s.tracks.forEach(async song => {
                    c++;
                    let p = await a.client.player.get(a.message.guild.id);
                    if (!p) p = await a.client.player.join({
                        guild: a.message.guild.id,
                        channel: vChannel.id,
                        host: config.lavalink.host
                    }, { selfdeaf: true });

                    queue.songs.push({title: song.info.title.replace(/`/g, "'"), channel: song.info.author, length: song.info.length, requester: a.message.author.tag, url: song.info.uri, track: song.track});
                });
                
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\n${a.strings.getMsg("music_loaded").replace("#COUNT#", c)}`, "#00ff00");

                setTimeout(async () => {
                    let p = await a.client.player.get(a.message.guild.id);
                    if(p.playing) {} else {
                        let song = queue.songs.shift();
                        if(!song) return;
                        player.play(song, a.client, a.message).then(() => {
                            cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["play"])} | ${global.up(this.name)}\n${a.strings.getMsg("music_playing").replace("#SONG#", song.title).replace("#CHANNEL#", song.channel)}`);
                        });
                    }
                }, 300);
            } else {
                await this.play(s.tracks[0], a);
            }
            ok = true;
        });
    }
    async play(song, a) {
        if(!song) return cmd.error(a, a.strings.getMsg("music_nofound"));
        let s = {title: song.info.title.replace(/`/g, "'"), channel: song.info.author, length: song.info.length, requester: a.message.author.tag, url: song.info.uri, track: song.track};
        player.play(s, a.client, a.message).then(t => {
            if(t == "play") {
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["play"])} | ${global.up(this.name)}\n${a.strings.getMsg("music_playing_play").replace("#SONG#", s.title).replace("#CHANNEL#", s.channel)}`);
            } else {
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["plus"])} | ${global.up(this.name)}\n${a.strings.getMsg("music_added").replace("#SONG#", s.title).replace("#CHANNEL#", s.channel)}`);
            }
        });
    }
}