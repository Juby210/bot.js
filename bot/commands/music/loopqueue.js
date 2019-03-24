const qc = require("./f/queue");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "loopqueue",
            aliases: ["lq"],
            reqVC: true
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player || !player.playing) {
            return cmd.error(a, a.strings.getMsg("music_playernull"));
        }
        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];
        if(queue.loopqueue) {
            queue.loopqueue = false;
            cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.done)} | ${global.up(this.name)}\n${a.strings.getMsg("music_loopoff")}`);
        } else {
            queue.loopqueue = true;
            cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.done)} | ${global.up(this.name)}\n${a.strings.getMsg("music_loopon")}`);
        }
    }
}