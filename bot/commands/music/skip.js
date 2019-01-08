const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "skip",
            aliases: [">>", "s"],
            reqVC: true
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const player = a.client.player.get(a.message.guild.id);
        if (!player) {
            return cmd.error(a, a.strings.getMsg("music_playernull"));
        }
        await player.stop();
        a.message.react(a.emoji.get(a.emojis.skip));
    }
}