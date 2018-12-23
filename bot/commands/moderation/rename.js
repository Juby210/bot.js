const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = new cmd({
    name: "rename",
    perms: ["MANAGE_NICKNAMES"],
    botperms: ["MANAGE_NICKNAMES"],
    run: async (a = {}) => {
        if(!a.args[0]) return cmd.error(a, a.strings.getMsg("invalidargscount").replace("#PREFIX#", a.prefix).replace("#CMD#", "rename"));
        let nick = a.args.slice(1).join(" ");
        util.searchUser(a.message, a.args[0], false).then(user => {
            const member = a.message.guild.member(user);
            member.setNickname(nick).then(a.message.react(a.emoji.get(a.emojis.done))).catch(e => {
                if(e.code == 50013) cmd.error(a, a.strings.getMsg("rename_error")); else util.crash(a.message.channel, e);
            });
        }).catch(() => {
            cmd.error(a, a.strings.getMsg("user_null"));
        });
    }
});