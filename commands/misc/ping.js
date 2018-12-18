const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    const m = await message.channel.send(`${strings.getMsg("holdon")}...`);
    m.edit(`:ping_pong: | Ping: **${m.createdTimestamp - message.createdTimestamp}**ms. Gateway (API): **${Math.round(client.ping)}**ms`);
}    

module.exports.help = {
    name:"ping"
}