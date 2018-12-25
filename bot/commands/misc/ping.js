const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "ping"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const m = await a.message.channel.send(`${a.strings.getMsg("holdon")}...`);
        m.edit(`:ping_pong: | Ping: **${m.createdTimestamp - a.message.createdTimestamp}**ms. Gateway (API): **${Math.round(a.client.ping)}**ms`);
    }
}