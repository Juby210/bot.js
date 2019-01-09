const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "invert",
            endpoint: "invert",
            arg: "url",
            argval: "avatar"
        });
    }
}