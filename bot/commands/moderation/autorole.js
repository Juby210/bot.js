const db = require('../../../util/db.js');
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "autorole",
            perms: ["MANAGE_GUILD"],
            botperms: ["MANAGE_GUILD"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(a.args[0] == null) {
            await db.getAutorole(a.message.guild.id).then(autorole => {
                if(autorole == undefined) autorole = {enabled: false, role: ""};
                if(autorole.enabled) {
                    cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("autorole_on")}:\n${a.strings.getMsg("role")}: <@&${autorole.role}>\n${a.strings.getMsg("commandinfo")}: \`${a.prefix}info autorole\``);
                } else {
                    cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("autorole_off")} \`${a.prefix}info autorole\`\n${a.strings.getMsg("oronindashboard")}`);
                }
            });
        }
    
        if(a.args[0] == "disable") {
            await db.getAutorole(a.message.guild.id).then(async autorole => {
                if(autorole == undefined) autorole = {enabled: false, role: ""};
                autorole.enabled = false;
                await db.update('guilds', a.message.guild.id, 'autorole', autorole);
                cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("turnedoff_autorole")}!`);
            });
        } else if(a.args[0] != null) {
            let rola;
            if (a.message.guild.roles.has(a.args[0])) {
                rola = a.message.guild.roles.get(args[0]).id;
            } else if (a.args[0].startsWith("<@&") && a.args[0].endsWith(">")) {
                let id = a.args[0].replace(/[<@&>]/g, "");
                if (a.message.guild.roles.has(id)) {
                    rola = a.message.guild.roles.get(id).id;
                } else {
                    rola = a.message.guild.roles.get(a.args[0]).id;
                }
            } else if (!rola) {
                a.message.channel.send(strings.getMsg("invalidrole"));
                return;
            }
    
            await db.getAutorole(a.message.guild.id).then(async autorole => {
                if(autorole == undefined) autorole = {enabled: false, role: ""};
                autorole.role = rola;
                autorole.enabled = true;
                await db.update('guilds', a.message.guild.id, 'autorole', autorole);
                cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("role")} <@&${rola}> (${rola}) ${a.strings.getMsg("turnedon_autorole")} \`${a.prefix}autorole disable\``);
            });
        }
    }
}