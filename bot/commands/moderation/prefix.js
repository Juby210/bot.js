const db = require('../../../util/db.js');
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "prefix",
            perms: ["MANAGE_GUILD"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(!a.args[0]) return cmd.error(a, a.strings.getMsg("prefix_null"));
        await db.update('guilds', a.message.guild.id, 'prefix', a.args[0]);
        cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\n${strings.getMsg("prefix_done")} \`${a.args[0]}\``);
    }
}