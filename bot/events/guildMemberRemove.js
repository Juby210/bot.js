const db = require("../../util/db.js");

module.exports = async member => {
    await db.getGoodbye(member.guild.id).then(goodbye => {
        if(goodbye == undefined) return;
        if(!goodbye.enabled || goodbye.msg == "" || goodbye.channel == "") return;
        var channel = member.guild.channels.get(goodbye.channel);
        if(channel == undefined) return;
        var msg = goodbye.msg.replace(new RegExp("#USER#", "g"), member.user.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.user.id}>`).replace(new RegExp("#TAG#", "g"), member.user.discriminator);
        channel.send(msg);
    });
}