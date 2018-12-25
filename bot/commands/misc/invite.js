const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "invite"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        cmd.msg(a.message, a.prefix, `${a.strings.getMsg("botinvite")}:`, `https://discordapp.com/oauth2/authorize?client_id=${a.client.user.id}&scope=bot&permissions=8`, `#00ff00`);
    }
}