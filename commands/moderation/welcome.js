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
        await db.getWelcome(guildID).then(welcome => {
            if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
            var we = new Discord.RichEmbed();
            we.setAuthor("Welcome", client.user.avatarURL);
            if(welcome.enabled) {
                we.setDescription(`${strings.getMsg("welcome_on")}:\n${strings.getMsg("channel")}: <#${welcome.channel}>\n${strings.getMsg("message")}: \`${welcome.msg}\`\n${strings.getMsg("commandinfo")}: \`${prefix}info welcome\``);
            } else {
                we.setDescription(`${strings.getMsg("welcome_off")} \`${prefix}info welcome\`\n${strings.getMsg("oronindashboard")}`);
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
            message.channel.send(strings.getMsg("invalid_channel"));
            return;
        }
        await db.getWelcome(guildID).then(async welcome => {
            if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
            welcome.channel = channel;
            await db.update('guilds', guildID, 'welcome', welcome);
            let ce = new Discord.RichEmbed()
            ce.setAuthor(`Welcome`, client.user.avatarURL);
            ce.setDescription(`${strings.getMsg("channel")} <#${channel}> (${channel}) ${strings.getMsg("channelset")}`)
            ce.setFooter("© Juby210", client.user.avatarURL);
            ce.setTimestamp()
            message.channel.send(ce);
        });
    }

    if (args[0] == "msg") {
        let msg = args.slice(1).join(' ');
        if (!msg) return message.channel.send(strings.getMsg("blankmsg"));

        await db.getWelcome(guildID).then(async welcome => {
            if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
            welcome.msg = msg;
            await db.update('guilds', guildID, 'welcome', welcome);
            let msge = new Discord.RichEmbed()
            msge.setAuthor(`Welcome`, client.user.avatarURL);
            msge.setDescription(`${strings.getMsg("message")}: \`${msg}\` ${strings.getMsg("messageset")}`);
            msge.setFooter("© Juby210", client.user.avatarURL);
            msge.setTimestamp();
            message.channel.send(msge);
        });
    }

    if(args[0] == "enable") {
        await db.getWelcome(guildID).then(async welcome => {
            if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
            if(welcome.channel == "" || welcome.msg == "") return message.channel.send(strings.getMsg("welcome_setfirst"));
            welcome.enabled = true;
            await db.update('guilds', guildID, 'welcome', welcome);
            let ee = new Discord.RichEmbed();
            ee.setAuthor("Welcome", client.user.avatarURL);
            ee.setDescription(strings.getMsg("turnedon_welcome"));
            ee.setFooter("© Juby210", client.user.avatarURL);
            ee.setTimestamp();
            message.channel.send(ee);
        });
    }

    if (args[0] == "disable") {
        await db.getWelcome(guildID).then(async welcome => {
            if(welcome == undefined) welcome = {enabled: false, channel: "", msg: ""};
            welcome.enabled = false;
            await db.update('guilds', guildID, 'welcome', welcome);
            let de = new Discord.RichEmbed();
            de.setAuthor(`Welcome`, client.user.avatarURL);
            de.setDescription(strings.getMsg("turnedoff_welcome"));
            de.setFooter("© Juby210", client.user.avatarURL);
            de.setTimestamp();
            message.channel.send(de);
        });
    }
}

module.exports.help = {
    name:"welcome",
    name2:"welcome <typ> [argument]",
    desc:"Typy: channel, msg, enable, disable\nDo wiadomości można dodać:\n#USER# - zamieniane jest na nazwę użytkownika\n#MENTION# - zamieniane jest na wzmiankę użytkownika\n#TAG# - zamieniane jest na tag użytkownika np. #1234\n#GUILD# - zamieniane jest na nazwę serwera",
    perms:"Zarządzanie serwerem"
}