const Discord = require('discord.js');
var clc = require("cli-colors");
var queuefile = require('../commands/muzyka/f/queue.js');
const config = require("../config.json");
var index = require('../index.js');
var util = require("../util/util");
const db = require('../util/db.js');
let queue = queuefile.getqueue;
const DBL = require("dblapi.js");

module.exports = (client) => {
    console.log(clc.cyan(`${client.user.tag} działa`));
    client.user.setStatus(config.settings.status);
    module.exports.emojiguild = client.guilds.get("488293188247879680");
    util.ustawstatus(index.client);
    db.load();
    require("../dashboard/server")();
    if(config.dbl.usedbl) {
        const dbl = new DBL(config.tokens.dbl, client);
        dbl.postStats(client.guilds.size);
    }
    client.guilds.forEach(g => {
        if (!queue.hasOwnProperty(g.id)) queue[g.id] = {}, queue[g.id].playing = false, queue[g.id].songs = [], queue[g.id].song = {}, queue[g.id].volume = 100, queue[g.id].loop = false;
    });
}