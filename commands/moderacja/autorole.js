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

    if(!message.member.hasPermission("MANAGE_GUILD")) {message.channel.send("Ta komenda wymaga uprawnienia `Zarządzanie serwerem.`"); message.react("❌"); return;}
    if(args[0] == null) {
        await db.getAutorole(guildID).then(autorole => {
            if(autorole == undefined) autorole = {enabled: false, role: ""};
            var ae = new Discord.RichEmbed();
            ae.setAuthor("Autorole", client.user.avatarURL);
            if(autorole.enabled) {
                ae.setDescription("Autorole na tym serwerze jest włączone:\nRola: <@&" + autorole.role + ">\nInformacje o tej komendzie: `" + prefix + "info autorole`");
            } else {
                ae.setDescription("Autorole na tym serwerze jest wyłączone, aby włączyć sprawdź `" + prefix + "info autorole`\nLub włącz w [dashboardzie bota](https://botjs.juby.cf)");
            }
            ae.setFooter("© Juby210", client.user.avatarURL);
            ae.setTimestamp()
            message.channel.send(ae);
        });
    }

    if(args[0] == "disable") {
        await db.getAutorole(guildID).then(async autorole => {
            if(autorole == undefined) autorole = {enabled: false, role: ""};
            autorole.enabled = false;
            await db.update('guilds', guildID, 'autorole', autorole);
            let de = new Discord.RichEmbed();
            de.setAuthor(`Wyłączyłeś Autorole`, client.user.avatarURL);
            de.setDescription(`Poprawnie wyłączyłeś autorole!`);
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
            message.channel.send("Ta rola jest nieprawidłowa! Podaj prawidłową rolę przez ID lub wzmiankę!");
            return;
        }

        await db.getAutorole(guildID).then(async autorole => {
            if(autorole == undefined) autorole = {enabled: false, role: ""};
            autorole.role = rola;
            autorole.enabled = true;
            await db.update('guilds', guildID, 'autorole', autorole);
            var ae = new Discord.RichEmbed();
            ae.setAuthor("Właczyłeś Autorole", client.user.avatarURL);
            ae.setDescription(`Rola <@&${rola}> (${rola}) została poprawnie ustalona jako autorole!\nAby wyłączyć autorole wpisz ` + "`" + prefix + "autorole disable`");
            ae.setFooter("© Juby210", client.user.avatarURL);
            ae.setTimestamp()
            message.channel.send(ae);
        });
    }
}

module.exports.help = {
    name: "autorole",
    name2: "autorole <argument>",
    desc: "Argumenty: id/wzmianka roli, disable"
}