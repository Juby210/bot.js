const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    message.delete();
    message.channel.send("*Shutting down in 30 s*").then(mes => {
        client.user.setActivity("Shutting down in 30 s!");
        setTimeout(() => {
            mes.edit("*Shutting down in 20 sek*");
            client.user.setActivity("Shutting down in 20 s!");
            setTimeout(() => {
                mes.edit("*Shutting down in 10 s*");
                client.user.setActivity("Shutting down in 10 s!");
                setTimeout(() => {
                    mes.edit("*Shutting down in 5 s*");
                    client.user.setActivity("Shutting down...");
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
                        } else if (c == 1) {mes.delete(); message.channel.send("Shutting down...");} else {
                            mes.edit(`*Shutting down in ${c} s*`);
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