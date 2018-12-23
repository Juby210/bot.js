const cmd = require("../../command.js");
module.exports = new cmd({
    name: "ping",
    run: async (client, message, args, strings) => {
        const m = await message.channel.send(`${strings.getMsg("holdon")}...`);
        m.edit(`:ping_pong: | Ping: **${m.createdTimestamp - message.createdTimestamp}**ms. Gateway (API): **${Math.round(client.ping)}**ms`);
    }
});