const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "forceoff"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        a.message.channel.send("Shutting down...");
        a.client.user.setStatus('invisible');
        setTimeout(() => {
            a.client.destroy();
            setTimeout(() => {
                process.exit(1);
            }, 100)
        }, 100);
    }
}