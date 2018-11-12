const Discord = require("discord.js");

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
        if(args[0].includes("`")) return message.channel.send("```Nie znaleziono użytkowników z tym tagiem```");
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
		if(args[0] == "0000") mem = "```Clyde#0000\nDeleted User#0000```";
        message.channel.send(mem);
    }
}

module.exports.help = {
    name:"tag",
    name2: "tag [tag]",
    desc:"Sprawdź kto ma tag taki sam jak ty!"
}