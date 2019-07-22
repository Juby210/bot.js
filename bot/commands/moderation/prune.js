const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "prune",
            aliases: ["clear"],
            perms: ["MANAGE_MESSAGES"],
            botperms: ["MANAGE_MESSAGES"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(!a.args[0]) return cmd.error(a, a.strings.getMsg("prune_value"));
        if(isNaN(a.args[0])) return cmd.error(a, a.strings.getMsg("prune_value"));
        const c = Number(a.args[0]);
        if (c >= 101) {
            cmd.error(a, a.strings.getMsg("prune_error"));
        } else {
            a.message.delete();
            a.message.channel.bulkDelete(c).then(msgs => {
                a.message.channel.send(`${a.emoji.get(a.emojis["done_green"])} | ${a.strings.getMsg("prune_success")} \`${msgs.size}\``).then(msg => msg.delete(5000));
            }).catch(e => require("../../../util/util").crash(a.message.channel, e, false));
        }
    }
}
