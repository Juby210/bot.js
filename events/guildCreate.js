var index = require('../index.js');
var util = require("../util/util");
var queuefile = require("../commands/music/f/queue.js");
const DBL = require("dblapi.js");
const config = require("../config.json");

module.exports = async (guild) => {
    util.ustawstatus(index.client);
    let queue = queuefile.getqueue;
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [], queue[guild.id].song = {}, queue[guild.id].volume = 100, queue[guild.id].loop = false;
    if(config.dbl.usedbl) {
        const dbl = new DBL(config.tokens.dbl, index.client);
        dbl.postStats(index.client.guilds.size);
    }
}