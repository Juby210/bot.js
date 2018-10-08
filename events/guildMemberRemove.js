const db = require("../util/db.js");

module.exports = async member => {
    await db.getGoodbye(member.guild.id).then(goodbye => {
        if(goodbye == undefined) return;
        if(!goodbye.enabled || goodbye.msg == "" || goodbye.channel == "") return;
        var channel = member.guild.channels.get(goodbye.channel);
        if(channel == undefined) return;
        var msg = goodbye.msg.replace("#USER#", member.user.username).replace("#GUILD#", member.guild.name).replace("#MENTION#", `<@${member.user.id}>`).replace("#TAG#", member.user.discriminator);
        channel.send(msg);
    });
}