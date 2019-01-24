const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "fox",
            endpoint: "fox",
            argval: "none"
        });
    }
}