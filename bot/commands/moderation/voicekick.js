const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "voicekick",
            perms: ["MOVE_MEMBERS"],
            botperms: ["MANAGE_CHANNELS", "MOVE_MEMBERS"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        util.searchUser(a.message, a.args[0], false).then(user => {
            const member = a.message.guild.member(user);
            a.message.guild.createChannel("Kick", "voice").then(vChan => {
                member.setVoiceChannel(vChan).then(mem => vChan.delete());
                a.message.react("✅");
            }).catch(err => util.crash(a.message.channel, err));
        }).catch(() => {
            cmd.error(a, a.strings.getMsg("user_null"));
        });
    }
}