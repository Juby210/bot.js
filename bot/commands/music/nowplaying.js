const qc = require("./f/queue");
const util = require("../../../util/util");
const Discord = require("discord.js");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "np",
            aliases: ["nowplaying"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player || !player.playing) return cmd.error(a, a.strings.getMsg("music_playernull"));

        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];
        const song = queue.np;
        let embed = new Discord.RichEmbed();
        embed.setAuthor(a.strings.getMsg("music_nptitle"), client.user.avatarURL);
        embed.setTitle(song.title);
        let t1 = util.formatLength(Date.now() - song.date, false);
        let t2 = util.formatLength(song.length);
        embed.setDescription(`\`${t1} / ${t2}\`\n[Link](${song.url})`);
        if(song.paused) embed.setDescription(`\`${a.strings.getMsg("music_paused")} / ${t2}\`\n[Link](${song.url})`);
        if(song.url.startsWith("https://www.youtube.com/")) {
            const id = song.url.replace("https://www.youtube.com/watch?v=", "");
            embed.setThumbnail(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        }
        embed.setFooter(`${a.strings.getMsg("music_requested")}: ${song.requester}`);
        a.message.channel.send(embed).then(async mes => {
            const vChannel = a.message.member.voiceChannel;
            if(!vChannel) return;

            mes.react(a.emoji.get(a.emojis["play_pause"])).then(() => mes.react(a.emoji.get(a.emojis["skip"])));
            const col = mes.createReactionCollector((rea, user) => user.id == a.message.author.id);
            col.on("collect", async (rea, user) => {
                switch (rea.emoji.id) {
                    case a.emojis["play_pause"]:
                        if(!song.paused) {
                            await player.pause(true);
                            queue.pause();
                        } else {
                            await player.pause(false);
                            queue.resume();
                        }
                        break;
                    case a.emojis["skip"]:
                        await player.stop();
                        break;
                }
            });
        });
    }
}