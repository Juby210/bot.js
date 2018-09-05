const Discord = require('discord.js');
const client = new Discord.Client();
var queuefile = require('../commands/music/f/queue.js');
let voiceban = require("../voiceban.json");
const config = require("../config.json");
const index = require("../index.js");

module.exports = guild => {
    queue = queuefile.getqueue;
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [], queue[g.id].volume = 100;
    queuefile.update(queue);
    if (!voiceban.hasOwnProperty(guild.id)) voiceban[guild.id] = {}, voiceban[guild.id].banned = [];
    index.ustaw_status();
};