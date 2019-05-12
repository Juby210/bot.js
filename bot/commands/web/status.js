const Discord = require("discord.js");
const request = require("request");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "status",
            aliases: ["discordstatus", "discordapi", "kurwaMacBotMaLagi", "apiMaRaka?"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        request({
            url: "https://srhpyqt94yxb.statuspage.io/api/v2/summary.json",
            method: "GET"
        }, (errr, rr, rbody) => {
            if(errr) return util.crash(a.message.channel, errr);

            const rres = JSON.parse(rbody);
            if(rres.incidents.length == 0) return cmd.msg(a.message, a.prefix, `Discord Status:`, `**Status**: ${rres.status.description}\n**Updated at**: ${new Date(rres.page.updated_at).toLocaleString()}\n\n[status.discordapp.com](https://status.discordapp.com)`);
            const inc = rres.incidents[0];
            cmd.msg(a.message, a.prefix, `Discord Status:`, `**Status**: ${rres.status.description}\n**Updated at**: ${new Date(rres.page.updated_at).toLocaleString()}\n
**Last incident**: ${inc.name}\n**Created at**: ${new Date(inc.created_at).toLocaleString()}\n**Updated at**: ${new Date(inc.updated_at).toLocaleString()}\n**Status**: ${inc.status}\n**Last update**: ${inc.incident_updates[0].body}\n\n[status.discordapp.com](https://status.discordapp.com)`);
        });
    }
}