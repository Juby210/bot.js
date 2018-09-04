const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
let strona = ("https://botjs.juby.cf/");
let github = ("https://github.com/Juby210-PL/bot.js");
var fs = require("fs");

module.exports.run = async (client, message, args) => {
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
    var muzyka = "";
    var muzykan = 0;
    loadcommands(co => {
      co.forEach(c => {
        switch(c.category) {
          case "BASIC":
            if(basic == "") {basic = c.name;} else {basic = `${basic}, ${c.name}`}
            basicn += 1;
            break;
          case "MODERACJA":
            if(moderacja == "") {moderacja = c.name;} else {moderacja = `${moderacja}, ${c.name}`}
            moderacjan += 1;
            break;
          case "WEB":
            if(web == "") {web = c.name;} else {web = `${web}, ${c.name}`}
            webn += 1;
            break;
          case "MISC":
            if(misc == "") {misc = c.name;} else {misc = `${misc}, ${c.name}`}
            miscn += 1;
            break;
          case "MUZYKA":
            if(muzyka == "") {muzyka = c.name;} else {muzyka = `${muzyka}, ${c.name}`}
            muzykan += 1;
            break;
        }
      });
      embed.addField(`BASIC (${basicn})`, "`" + basic + "`", true);
      embed.addField(`MODERACJA (${moderacjan})`, "`" + moderacja + "`", true);
      embed.addField(`WEB (${webn+3})`, "`dbl, shorten, urls`", true);
      embed.addField(`MISC (${miscn})`, "`" + misc + "`", true);
      embed.addField(`MUZYKA (${muzykan+11})`, "`play, pause, skip, join, leave, resume, vol, np, clearqueue, search, q`", true);
      embed.addField("INFORMACJA O KOMENDZIE", "`" + `${prefix}info <komenda>` + "`");
      embed.addBlankField();
      embed.addField("🔗 Przydatne linki:\n", "[[WWW]](" + strona + ")" + "\n" + "[[GitHub]](" + github + ")", true);
      embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
      embed.setTimestamp()
      message.channel.send(embed);
    });
}

module.exports.help = {
  name:"help",
  category:"BASIC"
}

function loadcommands(callback) {
  fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) {callback("err"); return;}
    var commands = [];
  
    jsfile.forEach((f, i) =>{
      let props = require(`./${f}`);
      commands.push({name:props.help.name, category:props.help.category});
    });
    callback(commands);
  });
}