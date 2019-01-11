const db = require('../../../util/db.js');
const util = require("../../../util/util");
const cmd = require("../../command.js");
const config = require("../../../config.json")
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "slowmode",
            perms: ["MANAGE_CHANNELS"],
            botperms: ["MANAGE_CHANNELS"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(!a.args[0]) {a.message.channel.send(`${a.strings.getMsg("invalidarg")}`); return;}
        if(isNaN(a.args[0])) {a.message.channel.send(`${a.strings.getMsg("slowmode_error")}  ``${a.args[0]}```); return;}
        if(a.args[0] >= 121) {a.message.channel.send(`${a.strings.getMsg("slowmode_errortime")}`); return;}
        util.req("PATCH", `https://discordapp.com/api/channels/${a.message.channel.id}`, config.tokens.token, a.args[0]).then(body => {
            if(a.args[0] == 0) {
                a.message.channel.send(`${a.strings.getMsg("slowmode_remove")}`);
            } else {
                a.message.channel.send(`${a.strings.getMsg("slowmode_success")} ` + `**${a.args[0]}s!**`);
            }
        }).catch(e => require("../../../util/util").crash(a.message.channel, e, false));
    }
}