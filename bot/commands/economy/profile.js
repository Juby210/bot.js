const cmd = require("../../command.js");
const db = require('../../../util/db.js');
const util = require("../../../util/util");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "profile"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        util.searchUser(a.message, a.args[0]).then(async user => {
        await db.addUser(user.id, a.message.guild.id);
        let userMoney = await db.getMoney(user.id);
        let userlvl = await db.getLVL(user.id, a.message.guild.id);
        if(user.bot) return cmd.error(a, `${a.strings.getMsg("bot_notallowed")}`);
        cmd.msg(a.message, a.prefix, `${user.tag}`, `Money: ${userMoney['money']}\nXP: ${userlvl['xp']}/${userlvl['lvlProm']}\nLVL: ${userlvl['lvl']}`);
        });
    }
}