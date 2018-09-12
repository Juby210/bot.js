const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    const m = await message.channel.send("Poczekaj...");
    m.edit(`:ping_pong: | Ping: **${m.createdTimestamp - message.createdTimestamp}**ms. Gateway (API): **${Math.round(client.ping)}**ms`);
}    

module.exports.help = {
    name:"ping",
    category:"MISC"
}