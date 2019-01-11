const db = require("../../util/db.js");

module.exports = async (oldMem, newMem) => {
    await db.getVoiceBans(newMem.guild.id).then(async bans => {
        var vChannel = newMem.voiceChannel;
        if(!vChannel) return;
        if(!bans) return;
        var zn = false;
        bans.forEach(id => {
            if(id == newMem.user.id) zn = true;
        });
        if(!zn) return;
        newMem.guild.createChannel("Kick", "voice").then(vChan => {
            newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
        }).catch(err => require("../../util/util").crash(null, err));
    });

    let vC = oldMem.voiceChannelID;
    let player = await global.client.player.get(oldMem.guild.id);
    if(!player || vC != player.channel) return;
    if(global.client.channels.get(player.channel).members.size == 1) {
        setTimeout(async () => {
            if (global.client.channels.get(player.channel).members.size == 1) {
                let queue = global.client.queue[oldMem.guild.id];
                if(queue) {
                    queue.songs = [];
                    queue.loop = false;
                }
                await global.client.player.leave(oldMem.guild.id);
            }
        }, 30 * 1000);
    }
}