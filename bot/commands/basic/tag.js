const cmd = require("../../command.js");
module.exports = new cmd({
    name: "tag",
    run: async (a = {}) => {
        if(a.args[0] == null) {
            let mem = "```";
            a.client.guilds.forEach(g => {
                g.members.forEach(m => {
                    if(m.user.discriminator == a.message.author.discriminator) {
                        if(!mem.includes(m.user.tag)) mem = mem + `\n` + m.user.tag;
                    }
                });
            });
            mem = mem + "```";
            a.message.channel.send(mem);
        } else {
            if(a.args[0].includes("`")) return cmd.msg(a.message, a.prefix, ``, `${a.emoji.get(a.emojis.error)} | Error\n${a.strings.getMsg("userwiththistagnotfound")}`, "#ff0000");
            let mem = "```";
            a.client.guilds.forEach(g => {
                g.members.forEach(m => {
                    if(m.user.discriminator == a.args[0]) {
                        if(mem.length >= 1970) return;
                        if(!mem.includes(m.user.tag)) mem = mem + `\n` + m.user.tag;
                    }
                });
            });
            mem = mem + "```";
            if(a.args[0] == "0000") mem = "```Clyde#0000\nDeleted User#0000```";
            if(mem == "``````") return cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.error)} | Error\n${a.strings.getMsg("userwithtagnotfound")} \`#${a.args[0]}\``, "#ff0000");
            a.message.channel.send(mem);
        }
    }
});