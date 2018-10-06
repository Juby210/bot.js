const Discord = require("discord.js");
const config = require("../../config.json");
let strona = ("https://botjs.juby.cf/");
let github = ("https://github.com/Juby210-PL/bot.js");
var fs = require("fs");
const db = require('../../util/db.js');

module.exports.run = async (client, message, args) => {
    let guildID;
    if(!message.guild) {
        guildID = '0';
    } else {
        guildID = message.guild.id;
    }
    const prefix = await db.getPrefix(guildID);
    var embed = new Discord.RichEmbed;
    embed.setAuthor(`Cześć! Jestem ${client.user.username} - Prefix: ${prefix}`, client.user.avatarURL);
    embed.setColor("#0099FF");
    var basic = "";
    var basicn = 0;
    var moderacja = "";
    var moderacjan = 0;
    var web = "";
    var webn = 0;
    var misc = "";
    var miscn = 0;
    var obrazki = "";
    var obrazkin = 0;
    var muzyka = "";
    var muzykan = 0;
    loadcommands(co => {
      co.forEach(c => {
        switch(c.category) {
          case "basic":
            if(basic == "") {basic = c.name;} else {basic = `${basic}, ${c.name}`}
            basicn += 1;
            break;
          case "moderacja":
            if(moderacja == "") {moderacja = c.name;} else {moderacja = `${moderacja}, ${c.name}`}
            moderacjan += 1;
            break;
          case "web":
            if(web == "") {web = c.name;} else {web = `${web}, ${c.name}`}
            webn += 1;
            break;
          case "misc":
            if(misc == "") {misc = c.name;} else {misc = `${misc}, ${c.name}`}
            miscn += 1;
            break;
          case "obrazki":
            if(obrazki == "") {obrazki = c.name;} else {obrazki = `${obrazki}, ${c.name}`}
            obrazkin += 1;
            break;
          case "muzyka":
            if(muzyka == "") {muzyka = c.name;} else {muzyka = `${muzyka}, ${c.name}`}
            muzykan += 1;
            break;
        }
      });
    });
    var alln = basicn + moderacjan + webn + miscn + muzykan;
      embed.setDescription(`<:mlist:488406259230310440> | Lista komend (${alln})`);
      embed.addField(`BASIC (${basicn})`, "`" + basic + "`", true);
      embed.addField(`MODERACJA (${moderacjan})`, "`" + moderacja + "`", true);
      embed.addField(`WEB (${webn})`, "`" + web + "`", true);
      embed.addField(`MISC (${miscn})`, "`" + misc + "`", true);
      embed.addField(`OBRAZKI (${obrazkin})`, "`" + obrazki + "`", true);
      embed.addField(`MUZYKA (${muzykan})`, "`" + muzyka + "`", true);
      embed.addField("INFORMACJA O KOMENDZIE", "`" + `${prefix}info <komenda>` + "`");
      embed.addBlankField();
      embed.addField("🔗 Przydatne linki:\n", "[[Dashboard]](" + strona + ") - Strona bota." + "\n" + "[[GitHub]](" + github + ") - Kod opensource bota.", true);
      embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
      embed.setTimestamp()
      message.channel.send(embed);
}

module.exports.help = {
  name:"help",
  name2:"help",
  desc:"No poprostu lista komend bota..."
}

function loadcommands(callback) {
  var commands = [];
  fs.readdirSync('./commands/').forEach(category => {
    const commandFile = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
    for (const file of commandFile) {
        const props = require(`../${category}/${file}`);
        commands.push({name:props.help.name, category:category});
    }
  });
  callback(commands);
}