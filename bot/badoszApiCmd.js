const config = require("../config.json");
const util = require("../util/util");
const snek = require("snekfetch");
const Discord = require("discord.js");
const command = require("./command.js");
module.exports = class badoszApiCmd extends command {
    constructor(a) {
        super({
            name: a.name,
            aliases: a.aliases,
            type: "img"
        });
        this.arg = a;
        this.run = this.r;
    }
    async r(a = {}) {
        if(this.arg.argval == "avatar") {
            util.searchUser(a.message, a.args[0]).then(user => {
                snek.get(`http://api.badosz.com/${this.arg.endpoint}?${this.arg.arg}=${user.avatarURL}`).set({ Authorization: config.tokens.badosz }).then(response => {
                    let embed = new Discord.RichEmbed();
                    embed.attachFile({attachment: response.body, name: 'image.png'});
                    embed.setImage("attachment://image.png");
                    embed.setColor("#E9A716");
                    embed.setDescription(`${user.tag} (${user.id})`);
                    embed.setFooter("api.badosz.com");
                    a.message.channel.send(embed);
                }).catch(err => util.crash(a.message.channel, err));
            });
        } else if (this.arg.argval == "none") {
            snek.get(`http://api.badosz.com/${this.arg.endpoint}`).set({ Authorization: config.tokens.badosz }).then(response => {
                let embed = new Discord.RichEmbed();
                embed.attachFile({attachment: response.body, name: 'image.png'});
                embed.setImage("attachment://image.png");
                embed.setColor("#E9A716");
                embed.setFooter("api.badosz.com");
                a.message.channel.send(embed);
            }).catch(err => util.crash(a.message.channel, err));
        } else {
            if(!a.args[0]) return command.error(a, a.strings.getMsg("invalidargscount").replace("#PREFIX#", a.prefix).replace("#CMD#", this.name));
            snek.get(`http://api.badosz.com/${this.arg.endpoint}?${this.arg.arg}=${encodeURIComponent(a.args.join(' '))}`).set({ Authorization: config.tokens.badosz }).then(response => {
                let embed = new Discord.RichEmbed();
                embed.attachFile({attachment: response.body, name: 'image.png'});
                embed.setImage("attachment://image.png");
                embed.setColor("#E9A716");
                embed.setFooter("api.badosz.com");
                a.message.channel.send(embed);
            }).catch(err => util.crash(a.message.channel, err));
        }
    }
}