const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "changemymind",
            aliases: ["cmm"],
            endpoint: "changemymind",
            arg: "text",
            argval: "text"
        });
    }
}