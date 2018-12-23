const cmd = require("../../command.js");
module.exports = new cmd({
    name: "forceoff",
    run: async (a = {}) => {
        a.message.channel.send("Shutting down...");
        a.client.user.setStatus('invisible');
        setTimeout(() => {
            a.client.destroy();
            setTimeout(() => {
                process.exit(1);
            }, 100)
        }, 100);
    }
});