var index = require('../index.js');
var ustaw = require("./ustaw.js");
const db = require('../util/db.js');

module.exports = (guild) => {
    ustaw.status(index.client);
    await db.updateStats(client.guilds.size, client.channels.size, client.users.size);
}