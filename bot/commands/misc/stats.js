const usage = require('pidusage');
const os = require("os");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "stats"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        usage(process.pid, (err, res) => {
            if(err) return util.crash(a.message.channel, err);

            const ram = Math.floor(res.memory / 1024 / 1024);
            const sram = Math.floor(os.totalmem() / 1024 / 1024);
            const { version } = require('discord.js');
            const uptime = util.formatLength(a.client.uptime);

            cmd.msg(a.message, a.prefix, `Stats:`, `
                **RAM**: \`${ram} MB\`
                **System RAM**: \`${sram} MB\`
                **CPU**: \`${Math.floor(res.cpu)}%\`
                **CPU Model**: \`${os.cpus()[0].model}\`
                **${a.strings.getMsg("users")}**: \`${a.client.users.size}\`
                **${a.strings.getMsg("channels")}**: \`${a.client.channels.size}\`
                **${a.strings.getMsg("servers")}**: \`${a.client.guilds.size}\`
                **Discord.js**: \`${version}\`
                **Node.js**: \`${process.version}\`
                **Platform**: \`${os.platform()} [${os.type()}]\`
                **Uptime**: \`${uptime}\`
                **${a.strings.getMsg("msg_ses")}**: ${a.client.stats.msg}
            `, "#ffd700");
        });
    }
}