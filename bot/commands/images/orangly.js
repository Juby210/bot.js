const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "orangly",
            endpoint: "orangly",
            arg: "url",
            argval: "avatar"
        });
    }
}