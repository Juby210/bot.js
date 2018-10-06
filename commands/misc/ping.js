const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const m = await message.channel.send("Poczekaj...");
    m.edit(`:ping_pong: | Ping: **${m.createdTimestamp - message.createdTimestamp}**ms. Gateway (API): **${Math.round(client.ping)}**ms`);
}    

module.exports.help = {
    name:"ping",
    name2:"ping",
    desc:"Wyświetla ping bota."
}