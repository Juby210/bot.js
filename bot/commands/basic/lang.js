const Discord = require("discord.js");
const db = require('../../../util/db.js');
const util = require('../../../util/util');
const SManager = require("../../../strings/manager");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "lang",
            perms: ["MANAGE_GUILD"]
        });
        this.run = this.r;
    }
    async r(a = {}) {
        util.getLangs().then(async langs => {
            if(!a.args[0]) {
                let embed = new Discord.RichEmbed();
                embed.setTitle(`${a.strings.getMsg("lang_title")}:`);
                let desc = "";
                langs.table.forEach(lang => {
                    desc = desc + `**${lang.id}** | **${lang.lang}** | Translators: **${lang.translators.join("**, **")}**\n`;
                });
                embed.setDescription(desc);
                embed.setFooter(a.strings.getMsg("lang_footer").replace("#PREFIX#", a.prefix));
                a.message.channel.send(embed);
            } else {
                if(!langs[a.args[0]]) return cmd.error(a, a.strings.getMsg("lang_notfound").replace("#PREFIX#", a.prefix));
                await db.update('guilds', a.message.guild.id, 'lang', a.args[0]);
                let s = new SManager(a.args[0]);
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis.done)} | Lang\n${s.getMsg("lang_done").replace("#LANG#", langs[a.args[0]].lang)}`);
            }
        });
    }
}