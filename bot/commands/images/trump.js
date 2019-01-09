const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "trump",
            endpoint: "trump",
            arg: "text",
            argval: "text"
        });
    }
}