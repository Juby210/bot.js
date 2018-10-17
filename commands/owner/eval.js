const Discord = require('discord.js');
const config = require("../../config.json");
var util = require("../../util/util");

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    var evalv = null;
    var text = args.slice(0).join(" ");
    try {evalv = eval(text);} catch(err) {util.crash(message.channel, err, false); return;}
    var embed = new Discord.RichEmbed();
    embed.setColor("#0FF49A");
    embed.setAuthor("EVAL - JS");
    embed.setTitle("KOMENDA:");
    embed.setDescription("```js\n" + text + "\n```");
    try{evalv = evalv.replace(config.tokens.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.tokens.dbl, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.ytapikey, "RaCzEjNiErAcZeJnIeRaCzEjNiE");} catch(err) {}
    embed.addField("ODPOWIEDŹ:", "```js\n" + evalv + "\n```");
    message.channel.send(embed);
}

module.exports.help = {
    name:"eval"
}