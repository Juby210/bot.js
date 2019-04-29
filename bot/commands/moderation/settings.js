const db = require('../../../util/db.js');
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "settings",
            perms: ["MANAGE_GUILD"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        let goodbye = await db.getGoodbye(a.message.guild.id)
        let autorole = await db.getAutorole(a.message.guild.id)
        let welcome = await db.getWelcome(a.message.guild.id)
        let lang = await db.getLang(a.message.guild.id)
        let lvltoggle = await db.getLvlToggle(a.message.guild.id)
        if (lvltoggle == undefined) lvltoggle = { enabled: false };
        if (goodbye == undefined) goodbye = { enabled: false, channel: "", msg: "" };
        if (welcome == undefined) welcome = { enabled: false, channel: "", msg: "" };
        if (autorole == undefined) autorole = { enabled: false, role: "" };

        if (!a.args[0]) {
            return cmd.msg(a.message, a.prefix, `${a.message.guild}`, `**Autorole**:
» **${a.strings.getMsg("settings_enabled")}**: ${autorole.enabled}
» **${a.strings.getMsg("settings_role")}**: ${autorole.enabled ? autorole.role == "" ? a.strings.getMsg("settings_none") : `<@&${autorole.role}>` : a.strings.getMsg("settings_none")}
**Welcome**:
» **${a.strings.getMsg("settings_enabled")}**: ${welcome.enabled}
» **${a.strings.getMsg("settings_channel")}**: ${welcome.channel == "" ? a.strings.getMsg("settings_none") : `<#${welcome.channel}>`}
» **${a.strings.getMsg("settings_message")}**: ${welcome.msg}
**Goodbye**:
» **${a.strings.getMsg("settings_enabled")}**: ${goodbye.enabled}
» **${a.strings.getMsg("settings_channel")}**: ${goodbye.channel == "" ? a.strings.getMsg("settings_none") : `<#${goodbye.channel}>`}
» **${a.strings.getMsg("settings_message")}**: ${goodbye.msg}
**Server**:
» **${a.strings.getMsg("settings_lang")}**: ${lang}
» **Prefix**: ${a.prefix}
» **${a.strings.getMsg("lvlupmessage")}**: ${lvltoggle.enabled}\n
» ${a.strings.getMsg("settings_check")}` + " ``#prefix#settings edit``".replace("#prefix#", a.prefix));
        } else if (a.args[0] === "welcome") {
            if (a.args[1] == "channel") {
                let channel;
                if (!a.args[2]) {
                    channel = a.message.channel.id;
                } else if (a.message.guild.channels.has(a.args[2])) {
                    channel = a.message.guild.channels.get(a.args[2]).id;
                } else if (a.args[2].startsWith("<#") && a.args[2].endsWith(">")) {
                    let id = a.args[2].replace(/[<#>]/g, "");
                    if (a.message.guild.channels.has(id)) {
                        channel = a.message.guild.channels.get(id).id;
                    } else {
                        channel = a.message.guild.channels.get(a.args[2]).id;
                    }
                } else if (!channel) {
                    a.message.channel.send(`${a.strings.getMsg("invalid_channel")}`);
                    return;
                }
                welcome.channel = channel;
                await db.update('guilds', a.message.guild.id, 'welcome', welcome);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_set").replace("#channel#", channel).replace("#channel#", channel)}`);
            }
            if (a.args[1] == "msg") {
                let msg = a.args.slice(2).join(' ');
                if (!msg) return a.message.channel.send(`${a.strings.getMsg("blankmsg")}`);

                welcome.msg = msg;
                await db.update('guilds', a.message.guild.id, 'welcome', welcome);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_msg").replace("#msg#", msg)}`);
            }
            if (a.args[1] == "enable") {
                if (welcome.channel == "" || welcome.msg == "") return a.message.channel.send(`${a.strings.getMsg("blankmsg")}`);
                welcome.enabled = true;
                await db.update('guilds', a.message.guild.id, 'welcome', welcome);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_msg_on")}`);
            }
            if (a.args[1] == "disable") {
                welcome.enabled = false;
                await db.update('guilds', a.message.guild.id, 'welcome', welcome);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_msg_off")}`);
            }
        } else if(a.args[0] == "autorole") {
            if(a.args[1] == "disable") {
                autorole.enabled = false;
                await db.update('guilds', a.message.guild.id, 'autorole', autorole);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("turnedoff_autorole")}!`);
            } else if (a.args[1] != null) {
                let rola;
                if (a.message.guild.roles.has(a.args[1])) {
                    rola = a.message.guild.roles.get(a.args[1]).id;
                } else if (a.args[0].startsWith("<@&") && a.args[1].endsWith(">")) {
                    let id = a.args[0].replace(/[<@&>]/g, "");
                    if (a.message.guild.roles.has(id)) {
                        rola = a.message.guild.roles.get(id).id;
                    } else {
                        rola = a.message.guild.roles.get(a.args[1]).id;
                    }
                } else if (!rola) {
                    a.message.channel.send(a.strings.getMsg("invalidrole"));
                    return;
                }
                autorole.role = rola;
                autorole.enabled = true;
                await db.update('guilds', a.message.guild.id, 'autorole', autorole);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("role")} <@&${rola}> (${rola}) ${a.strings.getMsg("turnedon_autorole")} \`${a.prefix}autorole disable\``);
            }
        } else if(a.args[0] == "goodbye") {
            if (a.args[1] == "channel") {
                let channel;
                if (!a.args[2]) {
                    channel = a.message.channel.id;
                } else if (a.message.guild.channels.has(a.args[2])) {
                    channel = a.message.guild.channels.get(a.args[2]).id;
                } else if (a.args[2].startsWith("<#") && a.args[2].endsWith(">")) {
                    let id = a.args[2].replace(/[<#>]/g, "");
                    if (a.message.guild.channels.has(id)) {
                        channel = a.message.guild.channels.get(id).id;
                    } else {
                        channel = a.message.guild.channels.get(a.args[2]).id;
                    }
                } else if (!channel) {
                    a.message.channel.send(`${a.strings.getMsg("invalid_channel")}`);
                    return;
                }
                    goodbye.channel = channel;
                    await db.update('guilds', a.message.guild.id, 'goodbye', goodbye);
                    return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_set").replace("#channel#", channel).replace("#channel#", channel)}`);
            }
        
            if (a.args[1] == "msg") {
                let msg = a.args.slice(2).join(' ');
                if (!msg) return a.message.channel.send(`${a.strings.getMsg("blankmsg")}`);
        
                    goodbye.msg = msg;
                    await db.update('guilds', a.message.guild.id, 'goodbye', goodbye);
                    return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_msg").replace("#msg#", msg)}`);
            }
        
            if(a.args[1] == "enable") {
                    if(goodbye.channel == "" || goodbye.msg == "") return a.message.channel.send(`${a.strings.getMsg("blankmsg")}`);
                    goodbye.enabled = true;
                    await db.update('guilds', a.message.guild.id, 'goodbye', goodbye);
                    return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("goodbye_msg_on")}`);
            }
        
            if (a.args[1] == "disable") {
                    goodbye.enabled = false;
                    await db.update('guilds', a.message.guild.id, 'goodbye', goodbye);
                    return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("goodbye_msg_off")}`);
            }
        } else if(a.args[0] == "prefix") {
            if(!a.args[1]) return cmd.error(a, a.strings.getMsg("prefix_null"));
            await db.update('guilds', a.message.guild.id, 'prefix', a.args[1]);
            return cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\n${a.strings.getMsg("prefix_done")} \`${a.args[1]}\``);
        } else if(a.args[0] == "edit") {
            return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("settings_edit").replace("#prefix#", a.prefix)}`);
        } else if(a.args[0] == "lvlup") {
            if(a.args[1] == "enable") {
                lvltoggle.enabled = true;
                await db.update('guilds', a.message.guild.id, 'lvlToggle', lvltoggle);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("lvlup_enable")}`);
            }
            if(a.args[1] == "disable") {
                lvltoggle.enabled = false;
                await db.update('guilds', a.message.guild.id, 'lvlToggle', lvltoggle);
                return cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("lvlup_disable")}`);
            }
        }
        cmd.error(a, `${a.strings.getMsg("settings_null").replace("#prefix#", a.prefix)}`);
    }
}
