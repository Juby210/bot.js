const cmd = require("../../command.js");
module.exports = new cmd({
    name: "ping",
    run: async (a = {}) => {
        const m = await a.message.channel.send(`${a.strings.getMsg("holdon")}...`);
        m.edit(`:ping_pong: | Ping: **${m.createdTimestamp - a.message.createdTimestamp}**ms. Gateway (API): **${Math.round(a.client.ping)}**ms`);
    }
});