const util = require("../../util/util");
const config = require("../../config.json");
const logger = require("../../util/logger.js");

module.exports = async (guild) => {
    util.ustawstatus();
    logger.serverlog(guild, true);
    require("../../util/poststats")(client.user.id, client.guilds.size, client.users.size);
}