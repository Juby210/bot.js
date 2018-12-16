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
        await db.getGoodbye(guildID).then(goodbye => {
            if(goodbye == undefined) goodbye = {enabled: false, channel: "", msg: ""};
            var we = new Discord.RichEmbed();
            we.setAuthor("Goodbye", client.user.avatarURL);
            if(goodbye.enabled) {
                we.setDescription("Goodbye na tym serwerze jest włączone:\nKanał: <#" + goodbye.channel + ">\nWiadomość: `" + goodbye.msg + "`\nInformacje o tej komendzie: `" + prefix + "info goodbye`");
            } else {
                we.setDescription("Goodbye na tym serwerze jest wyłączone, aby włączyć sprawdź `" + prefix + "info goodbye`");
            }
            we.setFooter("© Juby210", client.user.avatarURL);
            we.setTimestamp()
            message.channel.send(we);
        });
    }

    if (args[0] == "channel") {
        let channel;
        if (!args[1]) {
            channel = message.channel.id;
        } else if (message.guild.channels.has(args[1])) {
            channel = message.guild.channels.get(args[1]).id;
        } else if (args[1].startsWith("<#") && args[1].endsWith(">")) {
            let id = args[1].replace(/[<#>]/g, "");
            if (message.guild.channels.has(id)) {
                channel = message.guild.channels.get(id).id;
            } else {
                channel = message.guild.channels.get(args[1]).id;
            }
        } else if (!channel) {
            message.channel.send("Ten kanał jest nieprawidłowy! Podaj prawidłowy kanał przez ID lub wzmiankę!");
            return;
        }
        await db.getGoodbye(guildID).then(async goodbye => {
            if(goodbye == undefined) goodbye = {enabled: false, channel: "", msg: ""};
            goodbye.channel = channel;
            await db.update('guilds', guildID, 'goodbye', goodbye);
            let ce = new Discord.RichEmbed()
            ce.setAuthor(`Ustawiłeś kanał`, client.user.avatarURL);
            ce.setDescription(`Kanał <#${channel}> (${channel}) został poprawnie ustalony!`)
            ce.setFooter("© Juby210", client.user.avatarURL);
            ce.setTimestamp()
            message.channel.send(ce);
        });
    }

    if (args[0] == "msg") {
        let msg = args.slice(1).join(' ');
        if (!msg) return message.channel.send("Wiadomość nie może być pusta");

        await db.getGoodbye(guildID).then(async goodbye => {
            if(goodbye == undefined) goodbye = {enabled: false, channel: "", msg: ""};
            goodbye.msg = msg;
            await db.update('guilds', guildID, 'goodbye', goodbye);
            let msge = new Discord.RichEmbed()
            msge.setAuthor(`Ustawiłeś Wiadomość`, client.user.avatarURL);
            msge.setDescription("Wiadomość: ``" + msg  + "`` została poprawnie ustalona!");
            msge.setFooter("© Juby210", client.user.avatarURL);
            msge.setTimestamp();
            message.channel.send(msge);
        });
    }

    if(args[0] == "enable") {
        await db.getGoodbye(guildID).then(async goodbye => {
            if(goodbye == undefined) goodbye = {enabled: false, channel: "", msg: ""};
            if(goodbye.channel == "" || goodbye.msg == "") return message.channel.send("Ustaw najpierw waidomość/kanał!");
            goodbye.enabled = true;
            await db.update('guilds', guildID, 'goodbye', goodbye);
            let ee = new Discord.RichEmbed();
            ee.setAuthor("Włączyłeś Wiadomości", client.user.avatarURL);
            ee.setDescription("Poprawnie włączyłeś wiadomości GOODBYE!");
            ee.setFooter("© Juby210", client.user.avatarURL);
            ee.setTimestamp();
            message.channel.send(ee);
        });
    }

    if (args[0] == "disable") {
        await db.getGoodbye(guildID).then(async goodbye => {
            if(goodbye == undefined) goodbye = {enabled: false, channel: "", msg: ""};
            welcome.goodbye = false;
            await db.update('guilds', guildID, 'goodbye', goodbye);
            let de = new Discord.RichEmbed();
            de.setAuthor(`Wyłączyłeś Wiadomości`, client.user.avatarURL);
            de.setDescription(`Poprawnie wyłączyłeś wiadomości GOODBYE!`);
            de.setFooter("© Juby210", client.user.avatarURL);
            de.setTimestamp();
            message.channel.send(de);
        });
    }
}

module.exports.help = {
    name:"goodbye",
    name2:"goodbye <typ> [argument]",
    desc:"Typy: channel, msg, enable, disable\nDo wiadomości można dodać:\n#USER# - zamieniane jest na nazwę użytkownika\n#MENTION# - zamieniane jest na wzmiankę użytkownika\n#TAG# - zamieniane jest na tag użytkownika np. #1234\n#GUILD# - zamieniane jest na nazwę serwera",
    perms:"Zarządzanie serwerem"
}