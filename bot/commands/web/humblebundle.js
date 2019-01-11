const Discord = require("discord.js");
const request = require("request");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "humblebundle",
            aliases: ["hb"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        request({
            url: "https://www.humblebundle.com/androidapp/v2/service_check",
            method: "GET"
        }, (err, r, body) => {
            if(err) return util.crash(a.message.channel, err);

            const res = JSON.parse(body);
            let zn = false;
            let embed = new Discord.RichEmbed();
            embed.setDescription(`${a.emoji.get(a.emojis.list)} | ${a.strings.getMsg("hb_desc")}`);
            res.forEach(b => {
                zn = true; 
                embed.addField(b.bundle_name, b.url);
            });
            if(!zn) {
                embed.setDescription(embed.description + `\n${a.strings.getMsg("v_none")}`);
            }
            a.message.channel.send(embed);
        });
    }
}