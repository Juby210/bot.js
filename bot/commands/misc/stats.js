const usage = require('pidusage');
const os = require("os");
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
            if(err) return require("../../../util/util").crash(a.message.channel, err);

            const ram = Math.floor(res.memory / 1024 / 1024);
            const sram = Math.floor(os.totalmem() / 1024 / 1024);
            const { version } = require('discord.js');
            
            cmd.msg(a.message, a.prefix, `Stats:`, `
                **RAM**: \`${ram} MB\`
                **System RAM**: \`${sram} MB\`
                **CPU**: \`${Math.floor(res.cpu)}%\`
                **CPU Model**: \`${os.cpus()[0].model}\`
                **${a.strings.getMsg("users")}**: \`${a.client.users.size}\`
                **${a.strings.getMsg("channels")}**: \`${client.channels.size}\`
                **${a.strings.getMsg("servers")}**: \`${client.guilds.size}\`
                **Discord.js**: \`${version}\`
                **Node.js**: \`${process.version}\`
                **Platform**: \`${os.platform()} [${os.type()}]\`
            `, "#ffd700");
        });
    }
}