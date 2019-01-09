const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "note",
            endpoint: "note",
            arg: "text",
            argval: "text"
        });
    }
}