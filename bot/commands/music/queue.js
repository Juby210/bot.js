const Discord = require("discord.js");
const qc = require("./f/queue");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name:"queue",
            aliases: ["list", "q"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];
        const player = a.client.player.get(a.message.guild.id);

        if (!player) {
            return cmd.error(a, a.strings.getMsg("music_playernull"));
        }

        const embed = new Discord.RichEmbed();
        embed.setColor("#0099FF");
        embed.setTitle(`${a.emoji.get(a.emojis.list)} | ${a.strings.getMsg("music_queue_title").replace("#GUILD#", a.message.channel.guild)}`);
        embed.setDescription(a.strings.getMsg("music_queue_playing").replace("#SONG#", `**${queue.np.title}**`))
        if (!player.playing) embed.setDescription(a.strings.getMsg("music_queue_playingnull"));
    
        let c = 0;
        let time = 0;
        queue.songs.forEach((song, i) => {
            c++;
            time += song.length;
            if(i >= 10) return;
            let length = util.formatLength(song.length);
            embed.addField(`${i+1}. ${song.title}`, `${a.strings.getMsg("music_queue_list").replace("#TIME#", length).replace("#REQUESTER#", song.requester)}`);
        });
        if(c != 0) embed.setFooter(a.strings.getMsg("music_queue_footer").replace("#NUM#", c).replace("#TIME#", util.formatLength(time)) + ` | Loop: ${queue.loop} | Loopqueue: ${queue.loopqueue}`);
    
        a.message.channel.send(embed);
    }
}