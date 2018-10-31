const Discord = require("discord.js");
const config = require("../../config.json");
var fs = require("fs");

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    if(!client.commands.has(args[0])) {
        return message.channel.send("Nie ma takiej komendy!");
    }
    loadcommands(commands => {
        commands.forEach(c => {
            if(c.help.name == args[0]) {
                if(client.commands.get(args[0]).help.aliases != undefined) {
                    client.commands.get(args[0]).help.aliases.forEach(alias => {
                        client.commands.delete(alias);
                    });
                }
                delete require.cache[require.resolve(`../${c.category}/${c.file}`)];
                client.commands.delete(args[0]);
                const props = require(`../${c.category}/${c.file}`);
                client.commands.set(props.help.name, {category: c.category, run: props.run, help: props.help});
                if(client.commands.get(args[0]).aliases != undefined) {
                    props.help.aliases.forEach(alias => {
                        client.commands.set(alias, {category: c.category, run: props.run, help: props.help});
                    });
                }
                message.reply(`komenda **${props.help.name}** została załadowana z **./commands/${c.category}/${c.file}**!`);
            }
        });
    });
}

module.exports.help = {
    name: "reload"
}

function loadcommands(callback) {
    var commands = [];
    fs.readdirSync('./commands/').forEach(category => {
      const commandFile = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
      for (const file of commandFile) {
          const props = require(`../${category}/${file}`);
          commands.push({category: category, file: file, help: props.help});
      }
    });
    callback(commands);
}