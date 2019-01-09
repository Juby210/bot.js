const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "triggered",
            endpoint: "triggered",
            arg: "url",
            argval: "avatar"
        });
    }
}