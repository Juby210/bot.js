const db = require("../util/db.js");

module.exports = async (member) => {
    await db.getWelcome(member.guild.id).then(welcome => {
        if(welcome == undefined) return;
        if(!welcome.enabled || welcome.msg == "" || welcome.channel == "") return;
        var channel = member.guild.channels.get(welcome.channel);
        if(channel == undefined) return;
        var msg = welcome.msg.replace(new RegExp("#USER#", "g"), member.user.username).replace(new RegExp("#GUILD#", "g"), member.guild.name).replace(new RegExp("#MENTION#", "g"), `<@${member.user.id}>`).replace(new RegExp("#TAG#", "g"), member.user.discriminator);
        channel.send(msg);
    });

    await db.getAutorole(member.guild.id).then(autorole => {
        if(autorole == undefined) return;
        if(!autorole.enabled || autorole.role == "") return;
        var rola = member.guild.roles.get(autorole.role);
        if(rola == undefined) return;
        member.addRole(rola, "Bot.js autorole");
    });
}