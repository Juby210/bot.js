const db = require('../../../util/db.js');
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "welcome",
            perms: ["MANAGE_GUILD"],
            botperms: ["MANAGE_GUILD"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        if(a.args[0] == null) {
            await db.getWelcome(a.message.guild.id).then(welcome => {
                if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
                if(welcome.enabled) {
                    cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_on").replace("#CHANNEL#", welcome.channel).replace("#msg#", welcome.msg).replace("#prefix#", a.prefix)}`);
                } else {
                    cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_off").replace("#prefix#", a.prefix)}` + `${a.strings.getMsg("oronindashboard")}`);
                }
            });
        }
    
        if (a.args[0] == "channel") {
            let channel;
            if (!a.args[1]) {
                channel = a.message.channel.id;
            } else if (a.message.guild.channels.has(a.args[1])) {
                channel = a.message.guild.channels.get(a.args[1]).id;
            } else if (a.args[1].startsWith("<#") && a.args[1].endsWith(">")) {
                let id = a.args[1].replace(/[<#>]/g, "");
                if (a.message.guild.channels.has(id)) {
                    channel = a.message.guild.channels.get(id).id;
                } else {
                    channel = a.message.guild.channels.get(a.args[1]).id;
                }
            } else if (!channel) {
                a.message.channel.send(`${a.strings.getMsg("invalid_channel")}`);
                return;
            }
            await db.getWelcome(a.message.guild.id).then(async welcome => {
                if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
                welcome.channel = channel;
                await db.update('guilds', a.message.guild.id, 'welcome', welcome);
                cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_set").replace("#channel#", channel).replace("#channel#", channel)}`);
            });
        }
    
        if (a.args[0] == "msg") {
            let msg = a.args.slice(1).join(' ');
            if (!msg) return a.message.channel.send(`${a.strings.getMsg("blankmsg")}`);
    
            await db.getWelcome(a.message.guild.id).then(async welcome => {
                if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
                welcome.msg = msg;
                await db.update('guilds', a.message.channel.id, 'welcome', welcome);
                cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_msg").replace("#msg#", msg)}`);
            });
        }
    
        if(a.args[0] == "enable") {
            await db.getWelcome(a.message.channel.id).then(async welcome => {
                if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
                if(welcome.channel == "" || welcome.msg == "") return a.message.channel.send(`${a.strings.getMsg("blankmsg")}`);
                welcome.enabled = true;
                await db.update('guilds', a.message.channel.id, 'welcome', welcome);
                cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_msg_on")}`);
            });
        }
    
        if (a.args[0] == "disable") {
            await db.getWelcome(a.message.channel.id).then(async welcome => {
                if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
                welcome.enabled = false;
                await db.update('guilds', a.message.channel.id, 'welcome', welcome);
                cmd.msg(a.message, a.prefix, "", `${a.strings.getMsg("welcome_msg_off")}`);
            });
        }
    }
}