const db = require("../util/db.js");
const index = require("../index.js");
var queuefile = require("../commands/muzyka/f/queue.js");

module.exports = async (oldMem, newMem) => {
    await db.getVoiceBans(newMem.guild.id).then(async bany => {
        var vChannel = newMem.voiceChannel;
        if(vChannel == null) return;
        var zn = false;
        if(bany == undefined) return;
        bany.forEach(id => {
            if(id == newMem.user.id) zn = true;
        });
        if(!zn) return;
        newMem.guild.createChannel("Kick", "voice").then(vChan => {
            newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
        }).catch(err => require("../util/util").crash(null, err));
    });

    var vChann = oldMem.voiceChannelID;
    var player = await index.client.player.get(oldMem.guild.id);
    if (player != undefined) {
        if (vChann == player.channel) {
            if (index.client.channels.get(player.channel).members.size == 1) {
                setTimeout(async () => {
                    if (index.client.channels.get(player.channel).members.size == 1) {
                        let queue = queuefile.getqueue;
                        queue[oldMem.guild.id].playing = false;
                        queue[oldMem.guild.id].songs = [];
                        await index.client.player.leave(oldMem.guild.id);
                    }
                }, 2 * 60 * 1000);
            }
        }
    }
}