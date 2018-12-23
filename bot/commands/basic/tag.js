const cmd = require("../../command.js");
module.exports = new cmd({
    name: "tag",
    run: async (client, message, args, strings, prefix) => {
        if(args[0] == null) {
            let mem = "```";
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
            if(args[0].includes("`")) return cmd.msg(message, prefix, ``, "<:merror:489081457973919744> | Error\n" + strings.getMsg("userwiththistagnotfound"), "#ff0000");
            let mem = "```";
            client.guilds.forEach(g => {
                g.members.forEach(m => {
                    if(m.user.discriminator == args[0]) {
                        if(mem.length >= 1970) return;
                        if(!mem.includes(m.user.tag)) mem = mem + `\n` + m.user.tag;
                    }
                });
            });
            mem = mem + "```";
            if(args[0] == "0000") mem = "```Clyde#0000\nDeleted User#0000```";
            if(mem == "``````") return cmd.msg(message, prefix, "", `<:merror:489081457973919744> | Error\n${strings.getMsg("userwithtagnotfound")} \`#${args[0]}\``, "#ff0000");
            message.channel.send(mem);
        }
    }
});