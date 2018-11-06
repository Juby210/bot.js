const Discord = require("discord.js");
const config = require("../../config.json");
var fs = require("fs");

module.exports.run = async (client, message, args) => {
    if(message.author.id != config.settings.ownerid && message.author.id != config.settings.devid) return;
    if(!args[1]) {
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
                    if(props.help.aliases != undefined) {
                        try{props.help.aliases.forEach(alias => client.commands.set(alias, {category: c.category, run: props.run, help: props.help}));} catch(e) {}
                    }
                    message.reply(`komenda **${props.help.name}** została załadowana z **./commands/${c.category}/${c.file}**!`);
                }
            });
        });
    } else if (args[1] == "-l") {
        try{delete require.cache[require.resolve(args[0])]; client.commands.delete(args[0]);} catch(e) {}
        try {
            const props = require(args[0]);
            client.commands.set(props.help.name, {category: args[2], run: props.run, help: props.help});
            if(props.help.aliases != undefined) {
                    try{props.help.aliases.forEach(alias => client.commands.set(alias, {category: c.category, run: props.run, help: props.help}));} catch(e) {}
            }
            message.reply(`komenda **${props.help.name}** została załadowana z **${args[0]}**!`);
        } catch(e) {
            require("../../util/util").crash(message.channel, e, false);
        }
    } else if (args[1] == "-f") {
        try{
            delete require.cache[require.resolve(args[0])];
            message.reply("usunięto cache pliku **" + args[0] + "**");
        } catch(e) {require("../../util/util").crash(message.channel, e, false);}
    } else if(args[1] == "-c") {
        var count = 0;
        loadcommands(commands => {
            commands.forEach(c => {
                if(c.category == args[0]) {
                    try {
                        if(client.commands.get(c.help.name).help.aliases != undefined) {
                            client.commands.get(c.help.name).help.aliases.forEach(alias => {
                                client.commands.delete(alias);
                            });
                        }
                        delete require.cache[require.resolve(`../${c.category}/${c.file}`)];
                        client.commands.delete(c.help.name);
                    } catch(e) {}
                    const props = require(`../${c.category}/${c.file}`);
                    client.commands.set(props.help.name, {category: c.category, run: props.run, help: props.help});
                    if(props.help.aliases != undefined) {
                        try{props.help.aliases.forEach(alias => client.commands.set(alias, {category: c.category, run: props.run, help: props.help}));} catch(e) {}
                    }
                    count++;
                }
            });
        });
        message.reply((count == 0) ? `nie znaleziono tej kategorii!` : `załadowano **${count}** komend z kategorii **${args[0]}**!`);
    } else if (args[1] == "-d") {
        try {
            if(client.commands.get(args[0]).help.aliases != undefined) {
                client.commands.get(args[0]).help.aliases.forEach(alias => {
                    client.commands.delete(alias);
                });
            }
            delete require.cache[require.resolve(args[2])];
            client.commands.delete(args[0]);
            message.reply("usunięto komendę!");
        } catch(e) {require("../../util/util").crash(message.channel, e, false);}
    }
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