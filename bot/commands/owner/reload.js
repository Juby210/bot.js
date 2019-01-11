const fs = require("fs");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "reload"
        });
        this.run = this.r;
        this.loadcommands = this.lc;
    }
    async r(a = {}) {
        if (!a.args[1]) {
            if(!a.client.commands.has(a.args[0])) return cmd.error(a, `Nie ma takiej komendy!`);
            this.loadcommands(commands => {
                commands.forEach(c => {
                    if(c.cmd.name != a.args[0]) return;
                    c.cmd.aliases.forEach(alias => a.client.commands.delete(alias));
                    a.client.commands.delete(c.cmd.name);
                    delete require.cache[require.resolve(`../${c.category}/${c.file}`)];
                    const cmdc = new (require(`../${c.category}/${c.file}`));
                    let obj = {category: c.category};
                    Object.assign(obj, cmdc);
                    a.client.commands.set(cmdc.name, obj);
                    cmdc.aliases.forEach(alias => a.client.commands.set(alias, obj));
                    cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\nPrzeładowano komendę **${cmdc.name}** z **./bot/commands/${c.category}/${c.file}**`, "#00ff00");
                });
            });
        } else if (a.args[1] == "-l") {
            // WIP
            /*try{
                a.client.commands.delete(a.args[0]);
                delete require.cache[require.resolve(a.args[0])];
            } catch(e) {}
            try {

            } catch(e) {util.crash(a.message.channel, e, false);}*/
        } else if (a.args[1] == "-f") {
            try{
                delete require.cache[require.resolve(args[0])];
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\nUsunięto cache pliku **${a.args[0]}**`, "#00ff00");
            } catch(e) {util.crash(a.message.channel, e, false);}
        } else if (a.args[1] == "-c") {
            let count = 0;
            this.loadcommands(commands => {
                commands.forEach(c => {
                    if(c.category != a.args[0]) return;
                    try {
                        c.cmd.aliases.forEach(alias => a.client.commands.delete(alias));
                        a.client.commands.delete(c.cmd.name);
                        delete require.cache[require.resolve(`../${c.category}/${c.file}`)];
                    } catch(e) {}
                    const cmdc = new (require(`../${c.category}/${c.file}`));
                    let obj = {category: c.category};
                    Object.assign(obj, cmdc);
                    a.client.commands.set(cmdc.name, obj);
                    cmdc.aliases.forEach(alias => a.client.commands.set(alias, obj));
                    count++;
                });
            });
            if(count != 0) {
                cmd.msg(a.message, a.prefix, "", `${a.emoji.get(a.emojis["done_green"])} | ${global.up(this.name)}\nPrzeładowano **${count}** komend z kategorii **${a.args[0]}**`, "#00ff00");
            } else {
                cmd.error(a, `Nie znaleziono takiej kategorii!`);
            }
        }
    }
    lc(callback) {
        var commands = [];
        fs.readdirSync('./bot/commands/').forEach(category => {
          const commandFile = fs.readdirSync(`./bot/commands/${category}`).filter(file => file.endsWith('.js'));
          for (const file of commandFile) {
              const props = new (require(`../${category}/${file}`));
              commands.push({category: category, file: file, cmd: props});
          }
        });
        callback(commands);
    }
}