const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    message.delete();
    message.channel.send("*Zamykanie w ciągu 30 sek*").then(mes => {
        client.user.setActivity("Zamykanie w ciągu 30 sek!");
        setTimeout(() => {
            mes.edit("*Zamykanie w ciągu 20 sek*");
            client.user.setActivity("Zamykanie w ciągu 20 sek!");
            setTimeout(() => {
                mes.edit("*Zamykanie w ciągu 10 sek*");
                client.user.setActivity("Zamykanie w ciągu 10 sek!");
                setTimeout(() => {
                    mes.edit("*Zamykanie w ciągu 5 sek*");
                    client.user.setActivity("Zamykanie!");
                    var c = 5;
                    var eh = setInterval(() => {
                        c -= 1
                        if(c == 0) {
                            client.user.setStatus('invisible');
                            clearInterval(eh);
                            setTimeout(() => {
                                client.destroy();
                                setTimeout(() => {
                                    process.exit(1);
                                }, 100)
                            }, 100);
                        } else if (c == 1) {mes.delete(); message.channel.send("Zamykanie...");} else {
                            mes.edit(`*Zamykanie w ciągu ${c} sek*`);
                        }
                    }, 1000);
                }, 5000);
            }, 10000);
        }, 10000);
    });
}

module.exports.help = {
    name:"off"
}