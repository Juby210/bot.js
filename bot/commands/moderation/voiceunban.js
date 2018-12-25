const util = require("../../../util/util");
const db = require("../../../util/db.js");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "voiceunban",
            perms: ["MOVE_MEMBERS"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        util.searchUser(a.message, a.args[0], false).then(async user => {
            if(!user) return cmd.error(a, a.strings.getMsg("user_null"));
            let zn = false;
            await db.getVoiceBans(a.message.guild.id).then(async bans => {
                if(!bans || bans.length == 0) return cmd.error(a, a.strings.getMsg("voiceunban_error"));;
                bans.forEach(async (id, i) => {
                    if(id != user.id) return;
                    zn = true;
                    bans.splice(i, 1);
                    cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\n${user} ${a.strings.getMsg("voiceunban_success")} ${a.message.author}!`, "#00ff00");
                    await db.update('guilds', a.message.guild.id, 'voiceBans', bans);
                });
                if(!zn) {
                    cmd.error(a, a.strings.getMsg("voiceunban_error"));
                }
            });
        }).catch(() => {
            cmd.error(a, a.strings.getMsg("user_null"));
        });
    }
}