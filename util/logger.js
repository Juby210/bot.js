const Discord = require('discord.js');
const config = require("../config.json");

const log = function log(command, args, message) {
    if(message.author.id == config.settings.ownerid) return;
    //if(!config.logs.commands.includes(command)) return;
    const wh = new Discord.WebhookClient(config.logs.commands.webhookid, config.logs.commands.webhooktoken);
    const embed = new Discord.RichEmbed();
    embed.setTitle(`Used command: ${command} - ${message.content}`);
    embed.setDescription(`By: ${message.author.tag} (${message.author.id}) | Message ID: ${message.id} \n\n\`${message.author.avatarURL}\``);
    embed.setFooter(`GuildID: ${message.guild.id} | ChannelID: ${message.channel.id}`);
    embed.setColor("#79fa05")
    wh.send(embed);
}

const serverlog = function serverlog(guild, joined) {
    const wh = new Discord.WebhookClient(config.logs.servers.webhookid, config.logs.servers.webhooktoken);
    const embed = new Discord.RichEmbed();
    if(joined) {
        embed.setColor("#00ff00");
        embed.setTitle(`Joined to server: ${guild.name} (${guild.id})`);
    } else {
        embed.setColor("#ff0000");
        embed.setTitle(`Kicked from server: ${guild.name} (${guild.id})`);
    }
    embed.setDescription(`Owner: ${guild.owner.user.tag} (${guild.owner.user.id}) | Members: ${guild.members.size} | Bots: ${guild.members.filter(m=>m.user.bot).size} \n\n\`${guild.iconURL}\``);
    embed.setThumbnail(guild.iconURL);
    wh.send(embed);
}

module.exports.log = log;
module.exports.serverlog = serverlog;