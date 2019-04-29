const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "bassboost",
            reqVC: true
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player) return cmd.error(a, a.strings.getMsg("music_playernull"));
        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];

        if(!queue.bassboost) {
            await player.setEQ([
                {"band": 0, "gain": 4},
                {"band": 1, "gain": 8},
                {"band": 2, "gain": -8},
                {"band": 3, "gain": -4},
            ]);
            queue.bassboost = true;
            cmd.msg(a.message, a.prefix, "", `:sound: | ${global.up(this.name)}\n${a.strings.getMsg("music_bassboost")}`);
        } else {
            await player.setEQ([
                {"band": 0, "gain": 0},
                {"band": 1, "gain": 0},
                {"band": 2, "gain": 0},
                {"band": 3, "gain": 0},
            ]);
            queue.bassboost = false;
            cmd.msg(a.message, a.prefix, "", `:sound: | ${global.up(this.name)}\n${a.strings.getMsg("music_bassboost_off")}`);
        }
    }
}