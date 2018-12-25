const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "reload"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        cmd.msg(a.message, a.prefix, "", "Nie chciało mi się przepisywać tej komendy i na razie nie ma.");
    }
    loadcommands(callback) {
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