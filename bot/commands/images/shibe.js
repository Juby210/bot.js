const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "shibe",
            endpoint: "shibe",
            argval: "none"
        });
    }
}