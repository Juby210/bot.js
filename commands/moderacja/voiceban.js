const Discord = require("discord.js");
const db = require("../../util/db.js");

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
    if(!args[0]) {message.channel.send("Podaj kogo chcesz zbanować"); return;}
    if(message.mentions.users.first() == null) {
        var zn2 = false;
        message.guild.members.forEach(async memb => {
            if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                if(memb.user.id == client.user.id) {message.reply("mnie się nie banuje!"); return;}
                zn2 = true;
                message.guild.createChannel("Kick", "voice").then(vChan => {
                    memb.setVoiceChannel(vChan).then(mem => vChan.delete());
                }).catch(err => anticrash(message.channel, err));
                message.react("✅");
                await db.getVoiceBans(message.guild.id).then(async bany => {
                    if(bany == undefined) bany = [];
                    bany.push(memb.user.id);
                    await db.update('guilds', message.guild.id, 'voiceBans', bany);
                });
            }
        });
        if (zn2 == false) {
            message.reply("nie znaleziono takiego użytkownika!");
            return;
        }
    } else {
        var memb = message.guild.member(message.mentions.users.first());
        if(memb.user.id == client.user.id) {message.reply("mnie się nie banuje!"); return;}
        message.guild.createChannel("Kick", "voice").then(vChan => {
            memb.setVoiceChannel(vChan).then(mem => vChan.delete());
        }).catch(err => anticrash(message.channel, err));
        message.react("✅");
        await db.getVoiceBans(message.guild.id).then(async bany => {
            if(bany == undefined) bany = [];
            bany.push(memb.user.id);
            await db.update('guilds', message.guild.id, 'voiceBans', bany);
        });
    }
}

module.exports.help = {
    name: "voiceban",
    aliases: ["banvoice"]
}