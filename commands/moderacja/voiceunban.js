const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
if(!message.member.hasPermission("MOVE_MEMBERS")) {message.channel.send("Ta komenda wymaga uprawnienia `Przenieś członków`"); message.react("❌"); return;}
if(message.mentions.users.first() == null) {message.reply("wzmiankuj kogo chcesz odbanować")} else {
    var zn = false;
    var memb = message.guild.member(message.mentions.users.first());
    voiceban[message.guild.id].banned.forEach(ban => {
        if(ban.id == memb.user.id) {
            zn = true;
            voiceban[message.guild.id].banned.splice(ban, 1);
            message.channel.send(`<@${memb.user.id}> został odbanowany przez ${message.author.username}!`);
            fs.writeFile("../voiceban.json", JSON.stringify(voiceban), function(err) {
                if (err) console.log(err);
            });
        }
    });
    if(!zn) {
        message.channel.send("Ten użytkownik nie jest zbanowany!");
    }
}
}

module.exports.help = {
    name: "voiceunban",
    aliases: "unbanvoice"
}