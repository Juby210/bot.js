var index = require('../index.js');
var util = require("../util/util");
var queuefile = require("../commands/muzyka/f/queue.js");

module.exports = async (guild) => {
    util.ustawstatus(index.client);
    let queue = queuefile.getqueue;
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [], queue[guild.id].song = {}, queue[guild.id].volume = 100;
    if (!voiceban.hasOwnProperty(guild.id)) voiceban[guild.id] = {}, voiceban[guild.id].banned = [];
}