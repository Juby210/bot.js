const Discord = require("discord.js");
const db = require('../../util/db.js');
const util = require('../../util/util');

module.exports.run = async (client, message, args) => {
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);
    const prefix = await db.getPrefix(message.guild.id);
    util.getLangs().then(async langs => {
        if(message.member.hasPermission("MANAGE_GUILD") == true) {
            if(args[0] == null) {
                let embed = new Discord.RichEmbed();
                embed.setTitle(`${strings.getMsg("lang_title")}:`);
                let desc = "";
                langs.table.forEach(lang => {
                    desc = desc + `**${lang.lang}** | Translators: **${lang.translators.join("**, **")}**\n`;
                });
                embed.setDescription(desc);
                embed.setFooter(strings.getMsg("lang_footer").replace("#PREFIX#", prefix));
                message.channel.send(embed);
            } else {
                if(!langs[args[0]]) return message.channel.send(strings.getMsg("lang_notfound").replace("#PREFIX#", prefix));
                await db.update('guilds', message.guild.id, 'lang', args[0]);
                let s = new SManager(args[0]);
                message.reply(s.getMsg("lang_done").replace("#LANG#", langs[args[0]].lang));
                message.react("✅");
            }
        } else {
            message.reply(strings.getMsg("noperm"));
            message.react("❌");
        }
    });
}    

module.exports.help = {
    name:"lang"
}