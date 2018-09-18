const Discord = require("discord.js");

module.exports.run = async(client, message, args) => {
    if(args[0] == null) {message.channel.send("Nie prawidłowa ilość argumentów!"); message.react("❌"); return;}
    var text2 = args.slice(1).join(" ");
    if(!message.member.hasPermission("MANAGE_NICKNAMES")) {message.reply("Brak uprawnień!"); message.react("❌"); return;}
    if(message.mentions.users.first() == null) {
        var zn2 = false;
        message.guild.members.forEach(function(memb) {
            if(memb.user.username.toLowerCase() == args[0].toLowerCase()) {
                memb.setNickname(text2).then(() => message.react("✅")).catch(err => {message.channel.send("Błąd przy ustawianiu pseudonimu, prawdopodobnie bot jest niżej od użytkownika któremu chcesz ustawić pseudonim"); message.react("❌"); return;});
                zn2 = true;
            }
        });
        if (zn2 == false) {
            message.reply("nie znaleziono takiego użytkownika!");
            return;
        }
    } else {
        message.guild.members.find('id', message.mentions.users.first().id).setNickname(text2).then(() => message.react("✅")).catch(err => {message.channel.send("Błąd przy ustawianiu pseudonimu, prawdopodobnie bot jest niżej od użytkownika któremu chcesz ustawić pseudonim"); message.react("❌"); return;});
    }
}

module.exports.help = {
    name:"rename",
}