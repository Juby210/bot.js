const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "blurple",
            endpoint: "blurple",
            arg: "url",
            argval: "avatar"
        });
    }
}