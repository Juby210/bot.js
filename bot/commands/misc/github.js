const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "github",
            aliases: ["sourcecode", "code"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        cmd.msg(a.message, a.prefix, `${a.strings.getMsg("botcode")}:`, "https://github.com/juby210-PL/bot.js", "#ffd700");
    }
}