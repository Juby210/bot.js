const cmd = require("../../command.js");
module.exports = new cmd({
    name: "github",
    run: async (client, message, args, strings, prefix) => {
        cmd.msg(message, prefix, `${strings.getMsg("botcode")}:`, "https://github.com/juby210-PL/bot.js", "#ffd700");
    }
});