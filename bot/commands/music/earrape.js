const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "earrape",
            reqVC: true
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player) return cmd.error(a, a.strings.getMsg("music_playernull"));
        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];

        if(!queue.earrape) {
            player.volume(100000);
            queue.earrape = true;
            cmd.msg(a.message, a.prefix, "", `:sound: | ${global.up(this.name)}\n${a.strings.getMsg("music_earrape")}`);
        } else {
            player.volume(100);
            queue.earrape = false;
            cmd.msg(a.message, a.prefix, "", `:sound: | ${global.up(this.name)}\n${a.strings.getMsg("music_earrape_off")}`);
        }
    }
}