const Discord = require('discord.js');
const config = require("../config.json");

const log = function log(command, args, message) {
    if(message.author.id == config.settings.ownerid) return;
    //if(!config.logs.commands.includes(command)) return;
    const wh = new Discord.WebhookClient(config.logs.webhookid, config.logs.webhooktoken);
    var embed = new Discord.RichEmbed();
    embed.setTitle(`Used command: ${command} - ${message.content}`);
    embed.setDescription(`By: ${message.author.tag} (${message.author.id}) | Message ID: ${message.id} \n\n\`${message.author.avatarURL}\``);
    embed.setFooter(`GuildID: ${message.guild.id} | ChannelID: ${message.channel.id}`);
    embed.setColor("#79fa05")
    wh.send(embed);
}

exports.log = log;