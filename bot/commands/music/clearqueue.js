const qc = require("./f/queue");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "clearqueue",
            aliases: ["cq"],
            reqVC: true
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(!a.client.queue[a.message.guild.id]) new qc(a.message.guild.id, a.client);
        let queue = a.client.queue[a.message.guild.id];
        queue.songs = [];
        a.message.react(a.emoji.get(a.emojis.done));
    }
}