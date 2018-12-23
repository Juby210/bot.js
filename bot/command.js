const Discord = require("discord.js");
module.exports = class Command {
    constructor (opts = {}) {
        Object.assign(this, opts);
        if(!this.aliases) this.aliases = [];
        if(!this.perms) this.perms = [];
        if(!this.botperms) this.botperms = [];
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
    static error(a = {}, er) {
        const e = new Discord.RichEmbed();
        e.setDescription(`${a.emoji.get(a.emojis.error)} | Error\n${er}`);
        e.setFooter(`© Juby210 & hamster | ${a.prefix}help`);
        e.setColor("#ff0000");
        a.message.channel.send(e);
    }
    static color() {
        return (Math.random() * 0xFFFFFF << 0).toString(16);
    }
};