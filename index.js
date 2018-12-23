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
const config = require("./config.json");
var clc = require("cli-colors");
require('./bot/events/eventLoader')(client);

module.exports.client = client;
fs.readdirSync('./bot/commands/').forEach(category => {
    const commandFile = fs.readdirSync(`./bot/commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commandFile) {
        const cmd = require(`./bot/commands/${category}/${file}`);
        console.log(clc.yellow(`[${category}] `) + clc.green(`./bot/commands/${category}/${file}`));
        let obj = {category};
        Object.assign(obj, cmd);
        client.commands.set(cmd.name, obj);
        try{
            cmd.aliases.forEach(alias => client.commands.set(alias, obj));
        } catch(e) {}
    }
});

client.login(config.tokens.token);