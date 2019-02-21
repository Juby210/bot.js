const logger = require("../../util/logger.js");
module.exports = (guild) => {
    require("../../util/util").ustawstatus();
    logger.serverlog(guild, false);
}