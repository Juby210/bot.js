const Discord = require("discord.js");
const config = require("../../config.json");
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
        var alln = basicn + moderacjan + webn + miscn + muzykan;
        embed.setDescription(`<:mlist:488406259230310440> | Lista komend (${alln})`);
        embed.addField(`BASIC (${basicn})`, "`" + basic + "`", true);
        embed.addField(`MODERACJA (${moderacjan})`, "`" + moderacja + "`", true);
        embed.addField(`WEB (${webn})`, "`" + web + "`", true);
        embed.addField(`MISC (${miscn})`, "`" + misc + "`", true);
        embed.addField(`MUZYKA (${muzykan})`, "`" + muzyka + "`", true);
        embed.addField("INFORMACJA O KOMENDZIE", "`" + `${prefix}info <komenda>` + "`");
        embed.addBlankField();
        embed.addField("🔗 Przydatne linki:\n", "[[WWW]](" + strona + ") - Strona bota." + "\n" + "[[GitHub]](" + github + ") - Kod opensource bota.", true);
        embed.setFooter("© Juby210 & hamster", client.user.avatarURL);
        embed.setTimestamp()
        message.channel.send(embed);
}

module.exports.help = {
  name:"help"
}

function loadcommands(callback) {
  var commands = [];
  fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) {callback("err"); return;}
  
    jsfile.forEach((f, i) =>{
      let props = require(`./${f}`);
      commands.push({name:props.help.name, category:props.help.category});
    });
    callback(commands);
  });
}
function loadmusiccmd(callback) {
  var commands2 = [];
  fs.readdir("./commands/music/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) {callback("err"); return;}
  
    jsfile.forEach((f, i) =>{
      let props = require(`./music/${f}`);
      commands2.push({name:props.help.name, category:props.help.category});
    });
    callback(commands2);
  });
}