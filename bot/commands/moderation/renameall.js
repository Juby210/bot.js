const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "renameall",
            perms: ["MANAGE_NICKNAMES"],
            botperms: ["MANAGE_NICKNAMES"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(!a.args[0]) return cmd.error(a, a.strings.getMsg("invalidargscount").replace("#PREFIX#", a.prefix).replace("#CMD#", this.name));
        let nick = a.args.slice(1).join(" ");
        cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.done)} | ${global.up(this.name)}\n${a.strings.getMsg("rename_working")}`);
        a.message.guild.members.forEach(mem => {
            mem.setNickname(nick);
        });
    }
}