const Discord = require("discord.js");
module.exports = class Command {
    constructor (opts = {}) {
        Object.assign(this, opts);
        if(!this.aliases) this.aliases = [];
        if(!this.perms) this.perms = [];
    }
    async run(a = {}) {}
    static msg(message, prefix, title = "", desc = "", color = (Math.random() * 0xFFFFFF << 0).toString(16)) {
        const e = new Discord.RichEmbed();
        e.setTitle(title);
        e.setDescription(desc);
        e.setFooter(`© Juby210 & hamster | ${prefix}help`);
        e.setColor(color);
        message.channel.send(e);
    }
    static color() {
        return (Math.random() * 0xFFFFFF << 0).toString(16);
    }
};