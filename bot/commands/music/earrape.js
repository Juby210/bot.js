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
        if (!player) {
            return cmd.error(a, a.strings.getMsg("music_playernull"));
        }
        player.volume(1000);
        cmd.msg(a.message, a.prefix, "", `:sound: | ${global.up(this.name)}\n${a.strings.getMsg("music_earrape")}`);
    }
}