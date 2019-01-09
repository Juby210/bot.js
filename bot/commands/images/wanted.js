const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "wanted",
            endpoint: "wanted",
            arg: "url",
            argval: "avatar"
        });
    }
}