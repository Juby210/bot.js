const db = require("../util/db.js");
var lock = false;
var index = require("../index.js");

module.exports = async (oldMem, newMem) => {
    if(lock) return;
    var vChannel = newMem.voiceChannel;
    if(vChannel == null) return;
    var zn = false;
    await db.getVoiceBans(newMem.guild.id).then(async bany => {
        bany.forEach(id => {
            if(id == newMem.user.id) zn = true;
        });
        if(!zn) return;
        newMem.guild.createChannel("Kick", "voice").then(vChan => {
            newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
        }).catch(err => require("./anti.js").crash(null, err));
    });
}