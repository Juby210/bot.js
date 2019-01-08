const qc = require("./f/queue");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "leave",
            aliases: ["disconnect"],
            reqVC: true
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player) {
            return cmd.error(a, a.strings.getMsg("music_playernull"));
        }
        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];
        queue.songs = [];
        await a.client.player.leave(a.message.guild.id);
        a.message.react(a.emoji.get(a.emojis.done));
    }
}