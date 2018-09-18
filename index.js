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
require('./events/eventLoader')(client);

module.exports.client = client;
module.exports.anticrash = async (chan, err, sendToOwner = true) => require("./events/anti.js").crash(chan, err, sendToOwner);
fs.readdirSync('./commands/').forEach(category => {
    const commandFile = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commandFile) {
        const props = require(`./commands/${category}/${file}`);
        console.log(clc.yellow(`[${category}] `) + clc.green(`./commands/${category}/${file}`));
        client.commands.set(props.help.name, props, category);
        client.commands.set(props.help.aliases, props, category);
    }
});

client.login(config.token);