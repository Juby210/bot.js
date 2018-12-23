const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = new cmd({
    name: "hackban",
    perms: ["BAN_MEMBERS"],
    botperms: ["BAN_MEMBERS"],
    run: async (a = {}) => {
        if(a.args[0] == null) {
            cmd.error(a, a.strings.getMsg("user_null"));
        } else {
            let reason = a.args.slice(1).join(' ');
            if(!reason) reason = a.strings.getMsg("nullreason");
            a.message.guild.ban(a.args[0], {reason:`${a.strings.getMsg("ban_by")} ${a.message.author.tag} ${a.strings.getMsg("reason")} ${reason}`}).then(user => {
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.ban)} | Hackban\n${a.strings.getMsg("ban_user")} ${user.tag || `<@${a.args[0]}>`} ${a.strings.getMsg("reason")} ${reason}`, "#ff0000");
            }).catch(e => {
                require("../../../util/util").crash(a.message.channel, e);
            });
        }
    }
});