const Discord = require('discord.js');
const client = new Discord.Client();
var queuefile = require('../commands/music/f/queue.js');
let voiceban = require("../voiceban.json");
const config = require("../config.json");
const index = require("../index.js");
var clc = require("cli-colors");

module.exports = (client) => {
    let queue = queuefile.getqueue;
    console.log(clc.cyan(`${client.user.tag} działa`));
    client.user.setStatus(config.status);
    index.ustaw_status();
    client.guilds.forEach(g => {
        if (!queue.hasOwnProperty(g.id)) queue[g.id] = {}, queue[g.id].playing = false, queue[g.id].songs = [], queue[g.id].volume = 100;
        queuefile.update(queue);
        if (!voiceban.hasOwnProperty(g.id)) voiceban[g.id] = {}, voiceban[g.id].banned = [];
    });
}