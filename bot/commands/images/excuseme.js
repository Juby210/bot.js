const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "excuseme",
            endpoint: "excuseme",
            arg: "text",
            argval: "text"
        });
    }
}