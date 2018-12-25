const config = require("../config.json");
const Discord = require("discord.js");
module.exports = class command {
    constructor (info = {}) {
        Object.assign(this, info);
        if(!this.aliases) this.aliases = [];
        if(!this.perms) this.perms = [];
        if(!this.botperms) this.botperms = [];
    }
    static msg(message, prefix, title = "", desc = "", color = (Math.random() * 0xFFFFFF << 0).toString(16)) {
        const e = new Discord.RichEmbed();
        e.setTitle(title);
        e.setDescription(desc);
        e.setFooter(config.settings.footer.replace("#PREFIX#", prefix));
        e.setColor(color);
        message.channel.send(e);
    }
    static error(a = {}, er) {
        const e = new Discord.RichEmbed();
        e.setDescription(`${a.emoji.get(a.emojis.error)} | Error\n${er}`);
        e.setFooter(config.settings.footer.replace("#PREFIX#", a.prefix));
        e.setColor("#ff0000");
        a.message.channel.send(e);
    }
    static color() {
        return (Math.random() * 0xFFFFFF << 0).toString(16);
    }
};