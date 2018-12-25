const cmd = require("../../command.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "off"
        });
        this.run = this.r;
    }
    async r(a = {}) {
        a.message.delete();
        a.message.channel.send("*Shutting down in 30 s*").then(mes => {
            a.client.user.setActivity("Shutting down in 30 s!");
            setTimeout(() => {
                mes.edit("*Shutting down in 20 s*");
                a.client.user.setActivity("Shutting down in 20 s!");
                setTimeout(() => {
                    mes.edit("*Shutting down in 10 s*");
                    a.client.user.setActivity("Shutting down in 10 s!");
                    setTimeout(() => {
                        mes.edit("*Shutting down in 5 s*");
                        a.client.user.setActivity("Shutting down...");
                        let c = 5;
                        var eh = setInterval(() => {
                            c -= 1
                            if(c == 0) {
                                a.client.user.setStatus('invisible');
                                clearInterval(eh);
                                setTimeout(() => {
                                    a.client.destroy();
                                    setTimeout(() => {
                                        process.exit(1);
                                    }, 100)
                                }, 100);
                            } else if (c == 1) {mes.delete(); a.message.channel.send("Shutting down...");} else {
                                mes.edit(`*Shutting down in ${c} s*`);
                            }
                        }, 1000);
                    }, 5000);
                }, 10000);
            }, 10000);
        });
    }
}