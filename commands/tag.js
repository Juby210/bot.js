const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    if(args[0] == null) {
        var mem = "```";
        client.guilds.forEach(g => {
            g.members.forEach(m => {
                if(m.user.discriminator == message.author.discriminator) {
                    if(!mem.includes(m.user.tag)) mem = mem + `\n` + m.user.tag;
                }
            });
        });
        mem = mem + "```";
        message.channel.send(mem);
    } else {
        var mem = "```";
        client.guilds.forEach(g => {
            g.members.forEach(m => {
                if(m.user.discriminator == args[0]) {
                    if(mem.length >= 1970) return;
                    if(!mem.includes(m.user.tag)) mem = mem + `\n` + m.user.tag;
                }
            });
        });
        if(mem == "```") mem = mem + `Nie znaleziono użytkowników z tagiem #${args[0]}`;
        mem = mem + "```";
        message.channel.send(mem);
    }
}

module.exports.help = {
    name:"tag",
    category:"BASIC"
}