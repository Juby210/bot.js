const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "resetall",
            perms: ["MANAGE_NICKNAMES"],
            botperms: ["MANAGE_NICKNAMES"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.done)} | ${global.up(this.name)}\n${a.strings.getMsg("rename_reset")}`)
        a.message.guild.members.forEach(mem => {
            mem.setNickname("");
        });
    }
}