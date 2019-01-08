const util = require("../../util/util");
const DBL = require("dblapi.js");
const config = require("../../config.json");

module.exports = async (guild) => {
    util.ustawstatus();
    if(config.dbl.usedbl) {
        const dbl = new DBL(config.tokens.dbl, global.client);
        dbl.postStats(global.client.guilds.size);
    }
}