const Discord = require("discord.js");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);
    const SManager = require("../../strings/manager");
    const strings = await SManager.create(message.guild.id);

    if(!message.member.hasPermission("MANAGE_GUILD")) {message.channel.send(`${strings.getMsg("reqperms")} \`${strings.getMsg("manageguild")}\``); message.react("❌"); return;}
    if(args[0] == null) {
        await db.getAutorole(guildID).then(autorole => {
            if(autorole == undefined) autorole = {enabled: false, role: ""};
            var ae = new Discord.RichEmbed();
            ae.setAuthor("Autorole", client.user.avatarURL);
            if(autorole.enabled) {
                ae.setDescription(`${strings.getMsg("autorole_on")}:\n${strings.getMsg("role")}: <@&${autorole.role}>\n${strings.getMsg("commandinfo")}: \`${prefix}info autorole\``);
            } else {
                ae.setDescription(`${strings.getMsg("autorole_off")} \`${prefix}info autorole\`\n${strings.getMsg("oronindashboard")}`);
            }
            ae.setFooter("© Juby210", client.user.avatarURL);
            ae.setTimestamp();
            message.channel.send(ae);
        });
    }

    if(args[0] == "disable") {
        await db.getAutorole(guildID).then(async autorole => {
            if(autorole == undefined) autorole = {enabled: false, role: ""};
            autorole.enabled = false;
            await db.update('guilds', guildID, 'autorole', autorole);
            let de = new Discord.RichEmbed();
            de.setAuthor(`Autorole`, client.user.avatarURL);
            de.setDescription(`${strings.getMsg("turnedoff_autorole")}!`);
            de.setFooter("© Juby210", client.user.avatarURL);
            de.setTimestamp();
            message.channel.send(de);
        });
    } else if(args[0] != null) {
        let rola;
        if (message.guild.roles.has(args[0])) {
            rola = message.guild.roles.get(args[0]).id;
        } else if (args[0].startsWith("<@&") && args[0].endsWith(">")) {
            let id = args[0].replace(/[<@&>]/g, "");
            if (message.guild.roles.has(id)) {
                rola = message.guild.roles.get(id).id;
            } else {
                rola = message.guild.roles.get(args[0]).id;
            }
        } else if (!rola) {
            message.channel.send(strings.getMsg("invalidrole"));
            return;
        }

        await db.getAutorole(guildID).then(async autorole => {
            if(autorole == undefined) autorole = {enabled: false, role: ""};
            autorole.role = rola;
            autorole.enabled = true;
            await db.update('guilds', guildID, 'autorole', autorole);
            var ae = new Discord.RichEmbed();
            ae.setAuthor("Autorole", client.user.avatarURL);
            ae.setDescription(`${strings.getMsg("role")} <@&${rola}> (${rola}) ${strings.getMsg("turnedon_autorole")} \`${prefix}autorole disable\``);
            ae.setFooter("© Juby210", client.user.avatarURL);
            ae.setTimestamp()
            message.channel.send(ae);
        });
    }
}

module.exports.help = {
    name: "autorole",
    name2: "autorole <argument>",
    desc: "Argumenty: id/wzmianka roli, disable",
    perms: "Zarządzanie serwerem"
}