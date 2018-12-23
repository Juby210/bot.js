var index = require('../../index.js');
var util = require("../../util/util");
const DBL = require("dblapi.js");
const config = require("../../config.json");

module.exports = async (guild) => {
    util.ustawstatus(index.client);
    if(config.dbl.usedbl) {
        const dbl = new DBL(config.tokens.dbl, index.client);
        dbl.postStats(index.client.guilds.size);
    }
}