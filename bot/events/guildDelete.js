const logger = require("../../util/logger.js");
module.exports = (guild) => {
    require("../../util/util").ustawstatus();
    logger.serverlog(guild, false);
    require("../../util/poststats")(client.user.id, client.guilds.size);
}