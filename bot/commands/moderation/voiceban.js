const util = require("../../../util/util");
const db = require("../../../util/db.js");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "voiceban",
            perms: ["MOVE_MEMBERS"],
            botperms: ["MANAGE_CHANNELS", "MOVE_MEMBERS"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        util.searchUser(a.message, a.args[0], false).then(async user => {
            if(user.id == a.client.user.id) return cmd.error(a, a.strings.getMsg("botisntuser"));
            const member = a.message.guild.member(user);
            a.message.guild.createChannel("Kick", "voice").then(vChan => {
                member.setVoiceChannel(vChan).then(mem => vChan.delete());
            }).catch(err => util.crash(a.message.channel, err));
            await db.getVoiceBans(a.message.guild.id).then(async bans => {
                if(!bans) bans = [];
                bans.push(user.id);
                await db.update('guilds', a.message.guild.id, 'voiceBans', bans);
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.ban)} | ${global.up(this.name)}\n${a.strings.getMsg("voiceban").replace("#USER1#", a.message.author).replace("#USER2#", user)}`, "#ff0000");
            });
        }).catch(() => {
            cmd.error(a, a.strings.getMsg("user_null"));
        });
    }
}