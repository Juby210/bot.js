const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send(`${strings.getMsg("reqperms")} \`${strings.getMsg("movemembers")}\``); message.react("❌"); return;}
    if(!args[0]) {message.channel.send(`${strings.getMsg("user_null")}`); return;}
    if(message.mentions.users.first() == null) {
    var zn2 = false;
    message.guild.members.forEach(function(memb) {
        if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
            message.guild.createChannel("Kick", "voice").then(vChan => {
                memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                message.react("✅");
            }).catch(err => anticrash(message.channel, err));
            zn2 = true;
        }
    });
    if (zn2 == false) {
        message.reply(`${strings.getMsg("usernotfound")}`);
        return;
    }
} else {
    var memb = message.guild.member(message.mentions.users.first());
    message.guild.createChannel("Kick", "voice").then(vChan => {
        memb.setVoiceChannel(vChan).then(mem => vChan.delete());
        message.react("✅");
    }).catch(err => anticrash(message.channel, err));
    zn2 = true;
}
}

module.exports.help = {
    name: "voicekick",
    aliases: ["kickvoice"],
    name2:"voicekick <wzmianka/osoba>",
    desc:"Kickuje z kanału głosowego wybraną osobę",
    perms:"Przenieś członków"
}