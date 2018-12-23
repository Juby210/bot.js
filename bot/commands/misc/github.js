const cmd = require("../../command.js");
module.exports = new cmd({
    name: "github",
    run: async (a = {}) => {
        cmd.msg(a.message, a.prefix, `${a.strings.getMsg("botcode")}:`, "https://github.com/juby210-PL/bot.js", "#ffd700");
    }
});