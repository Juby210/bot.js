const Discord = require('discord.js');
const { PlayerManager } = require("discord.js-lavalink");
class MusicClient extends Discord.Client {

    constructor(options) {
        super(options);

        this.player = null;

        this.once("ready", this._ready.bind(this));
    }

    _ready() {
        this.player = new PlayerManager(this, [{ host: config.lavalink.host, port: config.lavalink.port, region: "eu-central", password: config.lavalink.password }], {
            user: this.user.id,
            shards: 1
        });
    }

}

const client = new MusicClient();
client.commands = new Discord.Collection();
var fs = require("fs");
let voiceban = require("./voiceban.json");
const config = require("./config.json");
const prefix = config.prefix;
var lock = false;
const DBL = require("dblapi.js");
const dbl = new DBL(config.dbl.token, client);
let reqV = config.dbl.requireVote;
const request = require('request');
let urls = require("./urls.json");
var clc = require("cli-colors");
var queuefile = require('./commands/music/m/queue.js');
require('./events/eventLoader')(client);

module.exports.client = client;

fs.readdirSync('./commands/').forEach(category => {
    const commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${category}/${file}`);
        console.log(`#LOADED ./commands/${category}/${file}`);
        client.commands.set(command.name, command, category);
    }
});
let queue = queuefile.getqueue;

client.on('guildCreate', guild => {
    queue = queuefile.getqueue;
    if (!queue.hasOwnProperty(guild.id)) queue[guild.id] = {}, queue[guild.id].playing = false, queue[guild.id].songs = [], queue[guild.id].song = {}, queue[guild.id].volume = 100;
    queuefile.update(queue);
    if (!voiceban.hasOwnProperty(guild.id)) voiceban[guild.id] = {}, voiceban[guild.id].banned = [];
    ustaw_status();
});

client.on('guildDelete', guild => {
    ustaw_status();
});

function ustaw_status() {
    if (client.guilds.size == 1) {
        client.user.setActivity(`testowanie na 1 serwerze | Prefix: ${prefix}`, { type: 'WATCHING' });
    } else {
        client.user.setActivity(`testowanie na ${client.guilds.size} serwerach | Prefix: ${prefix}`, { type: 'WATCHING' });
    }
}

client.on("voiceStateUpdate", (oldMem, newMem) => {
    if(lock) return;
    var vChannel = newMem.voiceChannel;
    if(vChannel == null) return;
    var zn = false;
    voiceban[newMem.guild.id].banned.forEach(ban => {
        if(ban.id == newMem.user.id) zn = true;
    });
    if(!zn) return;
    newMem.guild.createChannel("Kick", "voice").then(vChan => {
        newMem.setVoiceChannel(vChan).then(mem => vChan.delete());
    }).catch(err => anticrash(null, err));
});

client.on("message", message => {
    if(message.author.bot) return;
    if(message.author.id != config.ownerid) {
        if(lock) return;
    }
    if (message.mentions.users.first() == null) {} else {
        if (message.content != message.mentions.users.first()) {} else {
            if (message.mentions.users.first().id == client.user.id) {message.reply("mój prefix to `" + prefix + "`!");}
        }
    }
    if (!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let cmod = messageArray[0];
    let commandfile = client.commands.get(cmod.slice(prefix.length));

    if(config.dbl.usedbl) {
        if (!reqV.hasOwnProperty(command)) {if(commandfile) commandfile.run(client,message,args);} else {
            if(reqV[command] == true) {
                dbl.hasVoted(message.author.id).then(v => {
                    if(!v) {
                        var embed = new Discord.RichEmbed();
                        embed.setColor("#A61818");
                        embed.setTitle("Ta komenda jest niedostępna dla ciebie");
                        embed.setDescription(`Aby mieć dostęp do tej komendy zagłosuj na tego bota na [discordbots.org](https://discordbots.org/bot/${client.user.id}/vote)`);
                        embed.setFooter("Jeśli już zagłosowałeś poczekaj ok. 2 min");
                        message.channel.send(embed);
                        return;
                    } else {
                        if(commandfile) commandfile.run(client,message,args);
                    }
                }).catch(err => anticrash(message.channel, err));
            } else {
                if(commandfile) commandfile.run(client,message,args);
            }
        }
    } else {
        if(commandfile) commandfile.run(client,message,args);
    }
});

client.on("message", message => {
    if (!message.content.startsWith(prefix)) return;
    if(message.author.id != config.ownerid && message.author.id != config.devid) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var text = args.slice(0).join(" ");

    if(command == "eval") {
        var evalv = null;
        var text = args.slice(0).join(" ");
        try {evalv = eval(text);} catch(err) {anticrash(message.channel, err, false); return;}
        var embed = new Discord.RichEmbed();
        embed.setColor("#0FF49A");
        embed.setAuthor("EVAL - JS");
        embed.setTitle("KOMENDA:");
        embed.setDescription("```js\n" + text + "\n```");
        try{evalv = evalv.replace(config.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.dbl.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.ytapikey, "RaCzEjNiErAcZeJnIeRaCzEjNiE");} catch(err) {}
        embed.addField("ODPOWIEDŹ:", "```js\n" + evalv + "\n```");
        message.channel.send(embed);
    }
});

module.exports.anticrash = async (chan, err, sendToOwner = true) => anticrash(chan, err, sendToOwner);

function anticrash(chan, err, sendToOwner = true) {
    console.log("AntiCrash:");
    console.log(err);
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${client.user.username} - <:merror:489081457973919744> AntiCrash`);
    embed.setDescription(err);
    embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
    embed.setColor("#FF0000");
    if(chan != null) chan.send(embed);
    if(!sendToOwner) return;
    var owner = client.users.find("id", config.ownerid);
    if(owner == undefined) {return;}
    embed.addField(err.path, err.method);
    owner.send(embed);
}

client.on("error", err => {
    console.log("AntiCrash:");
    console.log(err);
    var owner = client.users.find("id", config.ownerid);
    if(owner == undefined) {return;}
    var embed = new Discord.RichEmbed();
    embed.setAuthor(`${client.user.username} - <:merror:489081457973919744> AntiCrash`);
    embed.setDescription(err);
    embed.setFooter(`Jeśli chcesz uniknąć tego błędu w przyszłości zgłoś go do: Juby210#5831`);
    embed.addField(err.path, err.method);
    embed.setColor("#FF0000");
    owner.send(embed);
});

client.login(config.token);