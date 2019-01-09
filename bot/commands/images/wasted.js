const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "wasted",
            endpoint: "wasted",
            arg: "url",
            argval: "avatar"
        });
    }
}