const Discord = require("discord.js");
let strona = ("https://botjs.juby.cf/");
let github = ("https://github.com/Juby210-PL/bot.js");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
  const prefix = await db.getPrefix(message.guild.id);
  const SManager = require("../../strings/manager");
  const strings = await SManager.create(message.guild.id);
  let embed = new Discord.RichEmbed;
  embed.setAuthor(`${strings.getMsg("hi")} ${client.user.username} - Prefix: ${prefix}`, client.user.avatarURL);
  embed.setColor("#0099FF");
  embed.setDescription(`<:mlist:488406259230310440> | ${strings.getMsg("commandlist")} [${client.commands.filter(c =>  c.category != "owner").size}]`);
  let cp = [];
  client.commands.forEach(c => {
    if(cp.includes(c)) return;
    if(c.category == "owner") return;
    let co = "";
    let ci = 0;
    client.commands.filter(cc => cc.category == c.category).forEach(cm => {
      cp.push(cm);
      if(co.includes(cm.help.name)) return;
      ci++;
      if(co == "") co = `\`${cm.help.name}\``; else co = co + `, \`${cm.help.name}\``;
    });
    embed.addField(`${strings.getCategory(c.category)} [${ci}]`, co)
  });
  embed.addField(strings.getMsg("commandinfo"), `\`${prefix}info <${strings.getMsg("command")}>\``);
  embed.addBlankField();
  embed.addField(`🔗 ${strings.getMsg("links")}:`, `[[Dashboard]](${strona}) | [[Github]](${github})`);
  message.channel.send(embed);
}

module.exports.help = {
  name:"help",
  aliases: ["?", "pomoc", "h"],
  name2:"help",
  desc:"No poprostu lista komend bota..."
}