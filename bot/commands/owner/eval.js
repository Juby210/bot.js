const Discord = require("discord.js");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "eval"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        let evalv = null;
        let text = a.args.join(" ");
        try {evalv = eval(text);} catch(err) {util.crash(a.message.channel, err, false); return;}
        let embed = new Discord.RichEmbed();
        embed.setColor("#0FF49A");
        embed.setAuthor("Eval - JS");
        embed.setTitle("Input:");
        embed.setDescription("```js\n" + text + "\n```");
        try{evalv = evalv.replace(config.tokens.token, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.tokens.dbl, "RaCzEjNiErAcZeJnIeRaCzEjNiE").replace(config.ytapikey, "RaCzEjNiErAcZeJnIeRaCzEjNiE");} catch(err) {}
        embed.addField("Output:", "```js\n" + evalv + "\n```");
        a.message.channel.send(embed);
    }
}