const Discord = require("discord.js");
const util = require("../../../util/util");
const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "avatar"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        const e = new Discord.RichEmbed();
        e.setColor(cmd.color());
        util.searchUser(a.message, a.args[0]).then(user => {
            e.setTitle(a.strings.getMsg("useravatar"));
            e.setDescription(a.strings.getMsg("useravatar_embed").replace("#TAG#", user.tag).replace("#ID#", user.id).replace("#URL#", user.avatarURL));
            e.setImage(user.avatarURL);
            e.setFooter(require("../../../config.json").settings.footer.replace("#PREFIX#", a.prefix));
            a.message.channel.send(e);
        });
    }
}