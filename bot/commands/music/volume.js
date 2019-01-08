const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "volume",
            aliases: ["vol"],
            reqVC: true
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player) {
            return cmd.error(a, a.strings.getMsg("music_playernull"));
        }
        if(isNaN(a.args[0])) return cmd.error(a, a.strings.getMsg("music_volume_number"));
        player.volume(a.args[0]);
        cmd.msg(a.message, a.prefix, "", `:sound: | ${global.up(this.name)}\n${a.strings.getMsg("music_volume").replace("#VOL#", a.args[0])}`);
    }
}