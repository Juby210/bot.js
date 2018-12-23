const config = require("../config.json");
const db = require("../util/db.js");

module.exports = class StringManager {
    constructor(lang) {
        this.lang = lang;
    }
    static async create(gid) {
        let l = await db.getLang(gid);
        let lang = l ? l : config.settings.lang;
        const o = new StringManager(lang);
        return o;
    }
    getMsg(msg) {
        let m = require(`./${this.lang}.json`).bot[msg];
        return m ? m : require(`./${config.settings.lang}.json`).bot[msg];
    }
    getMsgD(msg) {
        let m = require(`./${this.lang}.json`).dashboard[msg];
        return m ? m : require(`./${config.settings.lang}.json`).dashboard[msg];
    }
    getMsgDW(msg) {
        let m = require(`./${this.lang}.json`).dashboard_web[msg];
        return m ? m : require(`./${config.settings.lang}.json`).dashboard_web[msg];
    }
    getCommandInfo(command) {
        let m = require(`./${this.lang}.json`).commands[command];
        return m ? m : require(`./${config.settings.lang}.json`).commands[command];
    }
    getCategory(category) {
        let m = require(`./${this.lang}.json`).categories[category];
        return m ? m : require(`./${config.settings.lang}.json`).categories[category];
    }
    getPerm(perm) {
        let m = require(`./${this.lang}.json`).perms[perm];
        return m ? m : require(`./${config.settings.lang}.json`).perms[perm];
    }
}