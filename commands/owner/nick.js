const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
	var text = args.slice(0).join(" ");
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
        client.user.setUsername(text).then(message.react("✅"));
}

module.exports.help = {
    name:"nick"
}