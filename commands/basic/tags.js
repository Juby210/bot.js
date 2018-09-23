const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    var t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0; 
    client.guilds.forEach(g => {
        g.members.forEach(m => {
            var tx = Array.from(m.user.discriminator)[0];
            if(tx == "0") t0 += 1;
            if(tx == "1") t1 += 1;
            if(tx == "2") t2 += 1;
            if(tx == "3") t3 += 1;
            if(tx == "4") t4 += 1;
            if(tx == "5") t5 += 1;
            if(tx == "6") t6 += 1;
            if(tx == "7") t7 += 1;
            if(tx == "8") t8 += 1;
            if(tx == "9") t9 += 1;
        });
    });
    var embed = new Discord.RichEmbed();
    embed.setColor("#00AAAA");
    embed.setTitle("Najpopularniejsze tagi:");
    embed.setDescription(`#0xxx: ${t0}\n#1xxx: ${t1}\n#2xxx: ${t2}\n#3xxx: ${t3}\n#4xxx: ${t4}\n#5xxx: ${t5}\n#6xxx: ${t6}\n#7xxx: ${t7}\n#8xxx: ${t8}\n#9xxx: ${t9}`);
    message.channel.send(embed);
}

module.exports.help = {
    name: "tags"
}