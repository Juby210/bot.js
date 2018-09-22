const Discord = require("discord.js");
const config = require("../../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
        if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
        switch (args[0]) {
            case "online":
                client.user.setStatus("online");
                message.channel.send("Status ustawiony na Online!");
                break;
            case "idle":
                client.user.setStatus("idle");
                message.channel.send("Status ustawiony na Zaraz Wracam (idle)!");
                break;
            case "dnd":
                client.user.setStatus("dnd");
                message.channel.send("Status ustawiony na Nie przeszkadzać (dnd)!");
                break;
            case "invisible":
                client.user.setStatus("invisible");
                message.channel.send("Status ustawiony na Niewidzialny!");
                break;
            default:
                message.channel.send("`online | idle | dnd | invisible`");
        }
    }


module.exports.help = {
    name:"status"
} 