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
var queuefile = require('./commands/muzyka/m/queue.js');
require('./events/eventLoader')(client);

module.exports.client = client;
fs.readdirSync('./commands/').forEach(category => {
    const commandFile = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commandFile) {
        const props = require(`./commands/${category}/${file}`);
        console.log(`#LOADED ./commands/${category}/${file}`);
        client.commands.set(props.help.name, props, category);
    }
});

let queue = queuefile.getqueue;
module.exports.client = client;

module.exports.ustaw_status = client => ustaw_status(client);
function ustaw_status(client = new MusicClient()) {
    try{
        if (client.guilds.size == 1) {
            client.user.setPresence({ game: {name: `${prefix}help | 1 serwer`, type: 'WATCHING' }});
        } else {
            client.user.setPresence({ game: {name: `${prefix}help | ${client.guilds.size} serwerów`, type: 'WATCHING' }});
        }
    } catch(err) {}
}

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