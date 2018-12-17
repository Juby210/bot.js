const Discord = require("discord.js");
const config = require("../../config.json");

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    message.channel.send("Shutting down...");
    client.user.setStatus('invisible');
    setTimeout(() => {
        client.destroy();
        setTimeout(() => {
            process.exit(1);
        }, 100)
    }, 100);
}

module.exports.help = {
    name:"forceoff"
}