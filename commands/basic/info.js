const Discord = require("discord.js");
const db = require("../../util/db.js");

module.exports.run = async (client, message, args) => {
    const prefix = await db.getPrefix(message.guild.id);
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);

    var embed = new Discord.RichEmbed();
    embed.setColor("#0088FF");
    embed.setAuthor(`${client.user.username} - ${strings.getMsg("infocmd_title")}`, client.user.avatarURL);
    var c = client.commands.get(args[0]);
    if(!c) {
        embed.setTitle(strings.getMsg("cmdnotfound").replace("#PREFIX#", prefix));
    } else {
        embed.addField(prefix + strings.getCommandInfo(c.help.name).usage, strings.getCommandInfo(c.help.name).desc);
        if(c.help.aliases) {
            embed.addField(`${strings.getMsg("aliases")}:`, c.help.aliases.join(", "));
        }
        if(strings.getCommandInfo(c.help.name).perms) embed.setFooter(`${strings.getMsg("permissions")}: ` + strings.getCommandInfo(c.help.name).perms);
    }
    if(args[0] == null) embed.setTitle(strings.getMsg("invalidargscount").replace("#PREFIX#", prefix).replace("#CMD#", "info"));
    message.channel.send(embed);
}

module.exports.help = {
    name:"info"
}