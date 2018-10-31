const Discord = require("discord.js");
const db = require("../../util/db.js");
const fs = require("fs");

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);
    var embed = new Discord.RichEmbed();
    embed.setColor("#0088FF");
    embed.setAuthor(`${client.user.username} - Komenda info, czyli informacje o komendach`, client.user.avatarURL);
    switch (args[0]) {
        case "info":
            embed.setDescription("Naprawdę chcesz wyświetlić info o komendzie info? Eh.. no dobra");
            embed.addField(`${prefix}info <komenda>`, "Pokazuje informacje o komendzie, którą wpiszesz.");
            break; 
        default:
            var zn = false;
            var c = client.commands.get(args[0]);
            if(!c) {
                embed.setTitle("Nie znam takiej komendy, polecam sprawdzić `" + prefix + "help`");
            } else {
                embed.addField(prefix + c.help.name2, c.help.desc);
                if(c.help.aliases) {
                    embed.addField("Aliasy:", c.help.aliases.join(", "));
                }
                if(c.help.perms) embed.setFooter("Wymagane uprawnienia: " + c.help.perms);
            }
    }
    if(args[0] == null) embed.setTitle("Może byś dał jakąś komendę bo chyba nie chcesz info o komendzie info?");
    message.channel.send(embed);
}

module.exports.help = {
    name:"info"
}