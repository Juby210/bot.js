const cmd = require("../../command.js");
module.exports = new cmd({
    name: "invite",
    run: async (client, message, args, strings, prefix) => {
        cmd.msg(message, prefix, `${strings.getMsg("botinvite")}:`, `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`, `#00ff00`);
    }
});