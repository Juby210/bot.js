const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
let reaMess = require('./reaMess.json');
var prefix = config.prefix;

client.on('ready', () => {
    console.log(`${client.user.tag} ready`);
    client.user.setStatus(config.status);
    client.guilds.forEach(g => {
        if (!reaMess.hasOwnProperty(g.id)) reaMess[g.id] = {}, reaMess[g.id].messages = [];
    });
});

client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var text = args.slice(2).join(" ");

    if (command == "addmessage") {
        if(args[0] == null) {message.channel.send("Podaj id wiadomości!"); return;}
        var zn = false;
        reaMess[message.guild.id].messages.forEach(m => {
            if(message.id == m.id) {zn = true;}
        });
        if(zn) {message.channel.send("Ta wiadomość już została dodana! Dodaj reakcje za pomocą `" + prefix + "addreaction <id> <emoji> <nazwa roli>`"); return;}
        reaMess[message.guild.id].messages.push({id: args[0], reactions: []});
        message.channel.send("Wiadomość została dodana! Dodaj reakcje za pomocą `" + prefix + "addreaction <id> <emoji> <nazwa roli>`");
    }
    if (command == "addreaction") {
        if(args[2] == null) {message.channel.send("Nieprawidłowa ilość argumentów! Poprawne użycie: `" + prefix + "addreaction <id> <emoji> <nazwa roli>`"); return;}
        var zn = false;
        var mess = null;
        reaMess[message.guild.id].messages.forEach(m => {
            if(args[0] == m.id) {zn = true; mess = m;}
        });
        if(!zn) {message.channel.send("Najpierw dodaj wiadomość! `" + prefix + "addmessage <id>`"); return;}
        var msg = message.channel.messages.find("id", mess.id);
        if(msg == undefined) {
            message.channel.send("Nie znaleziono wiadomości z podanym id na tym kanale!");
            return;
        }
        var r = message.guild.roles.find("name", text);
        if(r == undefined) {
            message.channel.send("Nie znaleziono takiej roli!");
            return;
        }
        msg.react(args[1]).then(rea => {
            mess.reactions.push({em: rea.emoji, role: r.id});
            message.channel.send("Reakcja została dodana!");
        }).catch(() => {message.channel.send("Nieprawidłowe emoji!")});
    }
    if(command == "off") {
        if(message.author.id == config.ownerid) {
            client.user.setStatus('invisible');
            client.destroy();
            setTimeout(() => {
                process.exit(1);
            }, 100);
        }
    }
});

client.on('messageReactionAdd', (rea, user) => {
    if(user.bot) return;
    var msg = rea.message;
    var zn = false;
    var mess = null;
    reaMess[msg.guild.id].messages.forEach(m => {
        if(msg.id == m.id) {zn = true; mess = m;}
    });
    if(!zn) return;
    mess.reactions.forEach(r => {
        if(rea.emoji == r.em) {
            msg.guild.member(user).addRole(r.role);    
        }
    });
});

client.on('messageReactionRemove', (rea, user) => {
    if(user.bot) return;
    var msg = rea.message;
    var zn = false;
    var mess = null;
    reaMess[msg.guild.id].messages.forEach(m => {
        if(msg.id == m.id) {zn = true; mess = m;}
    });
    if(!zn) return;
    var member = msg.guild.member(user);
    mess.reactions.forEach(r => {
        if(rea.emoji == r.em) {
            if(member.roles.find("id", r.role) != undefined) {
                member.removeRole(r.role);
            }
        }
    });
});

client.login(config.token);