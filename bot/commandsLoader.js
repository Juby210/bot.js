const clc = require("cli-colors");
const fs = require("fs");

module.exports = client => {
    fs.readdirSync('./bot/commands/').forEach(category => {
        const commandFiles = fs.readdirSync(`./bot/commands/${category}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const cmd = require(`./commands/${category}/${file}`);
            console.log(`${clc.yellow(`[${category}]`)} ${clc.blue(`[${cmd.name}]`)} ${clc.green(`./bot/commands/${category}/${file}`)}`);
            let obj = {category};
            Object.assign(obj, cmd);
            client.commands.set(cmd.name, obj);
            try{
                cmd.aliases.forEach(alias => client.commands.set(alias, obj));
            } catch(e) {}
        }
    });
}