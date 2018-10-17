const db = require("../util/db.js");

module.exports = async (oldMem, newMem) => {
    var vChannel = newMem.voiceChannel;
    if(vChannel == null) return;
    var zn = false;
    await db.getVoiceBans(newMem.guild.id).then(async bany => {
        if(bany == undefined) return;
        bany.forEach(id => {
            if(id == newMem.user.id) zn = true;
        });
        if(!zn) return;
        newMem.guild.createChannel("Kick", "voice").then(vChan => {
            newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
        }).catch(err => require("../util/util").crash(null, err));
    });
}