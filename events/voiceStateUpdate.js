const Discord = require('discord.js');
const client = new Discord.Client();
var queuefile = require('../commands/music/f/queue.js');
let voiceban = require("../voiceban.json");
var lock = false;

module.exports = (oldMem, newMem) => {
    var vChann = oldMem.voiceChannel;
    if (oldMem.guild.voiceConnection) {
        if (vChann == oldMem.guild.voiceConnection.channel) {
            if (vChann.members.size == 1) {
                setTimeout(() => {
                    if (oldMem.guild.voiceConnection.channel.members.size == 1) {
                        oldMem.guild.voiceConnection.channel.leave();
                        queuefile.setvolume(oldMem.guild.id, 100);
                    }
                }, 300000); //300000 ms = 5 min
            }
        }
    }
    if(lock) return;
        var vChannel = newMem.voiceChannel;
    if(vChannel == null) return;
        var zn = false;
    voiceban[newMem.guild.id].banned.forEach(ban => {
    if(ban.id == newMem.user.id) zn = true;
    });
    if(!zn) return;
    newMem.guild.createChannel("Kick", "voice").then(vChan => {
        newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
    }).catch(err => anticrash(null, err));
}