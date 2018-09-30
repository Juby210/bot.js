const Discord = require("discord.js");
const db = require("../../util/db.js");

module.exports.run = async (client, message, args) => {
    if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
    if(message.mentions.users.first() == null) {message.reply("wzmiankuj kogo chcesz odbanować")} else {
        var zn = false;
        var memb = message.guild.member(message.mentions.users.first());

        await db.getVoiceBans(message.guild.id).then(async bany => {
            if(bany == undefined) return message.channel.send("Ten użytkownik nie jest zbanowany!");
            bany.forEach(async (id, i) => {
                if(id != memb.user.id) return;
                zn = true;
                bany.splice(i, 1);
                message.channel.send(`<@${id}> został odbanowany przez ${message.author.username}!`);
                await db.update('guilds', message.guild.id, 'voiceBans', bany);
            });
            if(!zn) {
                message.channel.send("Ten użytkownik nie jest zbanowany!");
            }
        });
    }
}

module.exports.help = {
    name: "voiceunban",
    aliases: ["unbanvoice"]
}