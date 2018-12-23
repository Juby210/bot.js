const Discord = require("discord.js");
let site = "https://botjs.juby.cf/";
let github = "https://github.com/Juby210-PL/bot.js";
const cmd = require("../../command.js");
module.exports = new cmd({
    name: "help",
    aliases: ["?", "h"],
    run: async (a = {}) => {
        if(!a.args[0]) {
            let embed = new Discord.RichEmbed();
            embed.setAuthor(`${a.strings.getMsg("hi")} ${a.client.user.username} - Prefix: ${a.prefix}`, a.client.user.avatarURL);
            embed.setColor("#0099FF");
            let cp = [];
            let allc = 0;
            a.client.commands.forEach(c => {
                if(cp.includes(c)) return;
                if(c.category == "owner") return;
                let co = "";
                let ci = 0;
                a.client.commands.filter(cc => cc.category == c.category).forEach(cm => {
                    cp.push(cm);
                    if(co.includes(`\`${cm.name}\``)) return;
                    ci++;
                    if(co == "") co = `\`${cm.name}\``; else co = co + `, \`${cm.name}\``;
                });
                embed.addField(`${a.strings.getCategory(c.category)} [${ci}]`, co);
                allc += ci;
            });
            embed.addField(a.strings.getMsg("commandinfo"), `\`${a.prefix}help <${a.strings.getMsg("command")}>\``);
            embed.addBlankField();
            embed.addField(`🔗 | ${a.strings.getMsg("links")}:`, `[[Dashboard]](${site}) | [[Github]](${github}) | [[Support Server]](https://discord.gg/6bfpCCt)`);
            embed.setDescription(`${a.emoji.get(a.emojis.list)} | ${a.strings.getMsg("commandlist")} [${allc}]`);
            a.message.channel.send(embed);
        } else {
            let embed = new Discord.RichEmbed();
            embed.setColor("#0088FF");
            embed.setAuthor(`${a.client.user.username} - ${a.strings.getMsg("infocmd_title")}`, a.client.user.avatarURL);
            let c = a.client.commands.get(a.args[0]);
            if(!c) {
                embed.setTitle(a.strings.getMsg("cmdnotfound").replace("#PREFIX#", a.prefix));
            } else {
                embed.addField(a.prefix + a.strings.getCommandInfo(c.name).usage, a.strings.getCommandInfo(c.name).desc);
                if(c.aliases.length != 0) {
                    embed.addField(`${a.strings.getMsg("aliases")}:`, `\`${c.aliases.join("`, `")}\``);
                }
                if(c.perms.length != 0) {
                    let t = [];
                    c.perms.forEach(perm => {
                        t.push(a.strings.getPerm(perm));
                    });
                    embed.setFooter(`${a.strings.getMsg("permissions")}: ${t.join(", ")}`);
                }
            }
            a.message.channel.send(embed);
        }
    }
});