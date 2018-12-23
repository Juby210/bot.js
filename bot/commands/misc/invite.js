const cmd = require("../../command.js");
module.exports = new cmd({
    name: "invite",
    run: async (a = {}) => {
        cmd.msg(a.message, a.prefix, `${a.strings.getMsg("botinvite")}:`, `https://discordapp.com/oauth2/authorize?client_id=${a.client.user.id}&scope=bot&permissions=8`, `#00ff00`);
    }
});