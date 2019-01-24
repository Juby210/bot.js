const cmd = require("../../badoszApiCmd.js");
module.exports = class command extends cmd {
    constructor() {
        super({
            name: "bird",
            endpoint: "bird",
            argval: "none"
        });
    }
}