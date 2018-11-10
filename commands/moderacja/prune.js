const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if(message.member.hasPermission("MANAGE_MESSAGES") == true) {
        if(args[0] == null) {
            message.reply("Podaj ilość wiadomości do usunięcia!");
            message.react("❌");
        } else {   
            const wartosc = parseInt(args[0], 10);
            if (wartosc >= 101) {
                message.channel.send("<:merror:489081457973919744> | Wartość " + wartosc + " jest za duża"); 
                return;
            } else {
            const wartosc = parseInt(args[0], 10);
            message.channel.fetchMessages({limit: wartosc +1}).then(messages => {
            message.channel.bulkDelete(wartosc).then(messages => {
            message.channel.send("<:mgreen_check_mark:488416404538785809> | Usunięto " + messages.size + " wiadomości").then(message => message.delete(5000));
            });
        });
    }
}
    } else {
    message.reply("Brak uprawnień!");
    message.react("❌");
    }
}
module.exports.help = {
    name: "prune",
    aliases: ["clear"],
    name2: "prune [ilość wiadomości]",
    desc:"Kasuje daną ilość wiadomości z kanału. Maksymalna wartość: 100",
    perms:"Zarządzanie wiadomościami"
}
