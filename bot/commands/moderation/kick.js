const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = new cmd({
    name: "kick",
    perms: ["KICK_MEMBERS"],
    botperms: ["KICK_MEMBERS"],
    run: async (a = {}) => {
        util.searchUser(a.message, a.args[0], false).then(user => {
            const member = message.guild.member(user);
            if (member.kickable == true) {
                let reason = a.args.slice(1).join(' ');
                if(!reason) reason = a.strings.getMsg("nullreason");
                member.kick(`${a.strings.getMsg("kick_by")} ` + a.message.author.tag + ` ${a.strings.getMsg("reason")} ${reason}`);
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.ban)} | Kick\n${a.strings.getMsg("kick_user")} ${member.user.tag} ${a.strings.getMsg("reason")} ${reason}`)
            } else {
                cmd.error(a, a.strings.getMsg("kick_perms"));
            }
        }).catch(() => {
            cmd.error(a, a.strings.getMsg("user_null"));
        });
    }
});