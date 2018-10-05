var index = require('../index.js');
var ustaw = require("./ustaw.js");
const db = require('../util/db.js');

module.exports = async (guild) => {
    ustaw.status(index.client);
    queue = queuefile.getqueue;
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [], queue[guild.id].song = {}, queue[guild.id].volume = 100;
    queuefile.update(queue);
    await db.updateStats(client.guilds.size, client.channels.size, client.users.size);
    if (!voiceban.hasOwnProperty(guild.id)) voiceban[guild.id] = {}, voiceban[guild.id].banned = [];
}