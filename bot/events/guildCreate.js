const util = require("../../util/util");
const DBL = require("dblapi.js");
const config = require("../../config.json");
const logger = require("../../util/logger.js");

module.exports = async (guild) => {
    util.ustawstatus();
    logger.serverlog(guild, true);
    if(config.dbl.usedbl) {
        const dbl = new DBL(config.tokens.dbl, global.client);
        dbl.postStats(global.client.guilds.size);
    }
}