const Discord = require('discord.js');
const { PlayerManager } = require("discord.js-lavalink");
class BotJSClient extends Discord.Client {
    constructor(options) {
        super(options);
        this.player = null;
        this.commands = new Discord.Collection();
        this.queue = {};
        this.stats = {};
        this.stats.msg = 0;
        this.once("ready", this._ready.bind(this));
    }
    _ready() {
        this.player = new PlayerManager(this, [{ host: config.lavalink.host, port: config.lavalink.port, region: "eu-central", password: config.lavalink.password }], {
            user: this.user.id,
            shards: 1
        });
    }
}
const client = new BotJSClient();
const config = require("./config.json");
require(`./bot/eventsLoader`)(client);
require(`./bot/commandsLoader`)(client);
global.client = client;
client.login(config.tokens.token);

global.up = string => {
    return string[0].toUpperCase() + string.slice(1);
}