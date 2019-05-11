const Discord = require('discord.js');
const clc = require("cli-colors");
const config = require("../../config.json");
const util = require("../../util/util");
const db = require('../../util/db.js');

module.exports = (client) => {
    console.log(clc.cyan(`${client.user.tag} ready`));
    client.user.setStatus(config.settings.status);
    module.exports.emojiguild = client.guilds.get("488293188247879680");
    util.ustawstatus();
    db.load();
    require("../../dashboard/server")();
    require("../../util/poststats")(client.user.id, client.guilds.size, client.users.size);
}