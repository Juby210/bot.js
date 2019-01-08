const qc = require("./f/queue");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "resume"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player || !player.playing) return cmd.error(a, a.strings.getMsg("music_playernull"));

        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];
        if(queue.np.paused) queue.resume();
        await player.pause(false);
        a.message.react(a.emoji.get(a.emojis.play));
    }
}