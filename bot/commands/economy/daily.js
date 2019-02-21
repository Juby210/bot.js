const cmd = require("../../command.js");
const db = require('../../../util/db.js');
const util = require("../../../util/util");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "daily"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        let userMoney = await db.getMoney(a.message.author.id, a.message.guild.id, a.message);
        let cooldown = 8.64e+7;
        let d = cooldown - (Date.now() - userMoney['daily']);
        let hours = Math.floor(d/1000/60/60);
        let mins = Math.floor(d/1000/60-hours*60);
        let sec = Math.floor(d/1000-mins*60-hours*60*60);
        if (userMoney['daily'] !== null && cooldown - (Date.now() - userMoney['daily']) > 0) {
            cmd.error(a, `${a.strings.getMsg("daily_hours").replace("#hours#", hours).replace("#min#", mins).replace("#sec#", sec)}`)
        } else {
            if(a.message.author.bot) return cmd.error(a, `${a.strings.getMsg("bot_notallowed")}`);
            await db.addMoney(a.message.author.id, a.message.guild.id, a.message);
            let money = await db.getMoney(a.message.author.id, a.message.guild.id, a.message);
            cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("daily_added").replace("#cash#", money['newMoney'])}`);
        }
    }
}