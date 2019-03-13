const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "replay",
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        const vChannel = a.message.member.voiceChannel;
        if(!vChannel) return;
        if (!player || !player.playing) {
            return cmd.error(a, a.strings.getMsg("music_playernull"));
        }
        await player.seek(0);
        cmd.msg(a.message, a.prefix, `${a.strings.getMsg("seek_success")}`);
    }
}