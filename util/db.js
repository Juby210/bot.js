const r = require('rethinkdb');
const config = require("../config.json");
const { database } = require('../config.json');

let connection;
const load = async function load() {
    try {
        connection = await r.connect(database);
        await Promise.all([
            r.tableCreate("users").run(connection),
            r.tableCreate("guilds").run(connection)
        ]);
        console.log('Tabele zostaly stworzone.');
    } catch(error) {
        if(error.message.includes("already exists")) return;
        console.log(error);
    }
};

const check = async function check(gid) {
    if (await r.table("guilds").get(gid).run(connection)) {
        return true;
    } else {
        try {
            await r.table("guilds").insert({
                id: gid,
                prefix: config.settings.prefix,
                users: [],
                voiceBans: [],
                welcome: {enabled: false, channel: "", msg: ""},
                autorole: {enabled: false, role: ""},
                lvlToggle: {enabled: false},
                lang: config.settings.lang
            }).run(connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};

const update = async function update(obj, id, k, v) {
    if(obj && id && k && v){
        try {
            await r.table(obj).get(id).update({[k]: v}).run(connection);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
     } else {
        return false;
    }
};

const getPrefix = async function getPrefix(id) {
    if(id){
        if(id == null) return false;
        try {
            const guild = await r.table('guilds').get(id).toJSON().run(connection);
            const prefix = await JSON.parse(guild).prefix;

            return prefix;
        } catch (e) {
            console.error(e);
            return false;
        }
    } else {
        return false;
    }
};

const getUrls = async function getUrls(userid) {
    if(userid) {
        try {
            var user = await r.table('users').get(userid).toJSON().run(connection);
            if(user == null) return false;
            return JSON.parse(user).urls;
        } catch(e) {
            console.log(e);
            return false;
        }
    } else {
        return false;
    }
}

const addUrl = async function addUrl(short, full, userid) {
    if(short && full && userid) {
        try {
            var user = await r.table('users').get(userid).run(connection);
            if(user) {
                var usr = await r.table('users').get(userid).toJSON().run(connection);
                var urls = JSON.parse(usr).urls;
                urls.push({short: short, full: full});
                await r.table('users').get(userid).update({
                    urls: urls
                }).run(connection);
            } else {
                await r.table('users').insert({
                    id: userid,
                    urls: [{short: short, full: full}]
                }).run(connection);
            }
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    } else {
        return false;
    }
}

const getVoiceBans = async function getVoiceBans(gid) {
    if(gid) {
        try {
            var guild = await r.table('guilds').get(gid).toJSON().run(connection);
            if(guild == null) return false;
            return JSON.parse(guild).voiceBans;
        } catch(e) {
            console.log(e);
            return false;
        }
    } else {
        return false;
    }
}

const getWelcome = async function getWelcome(gid) {
    if(gid) {
        try {
            var guild = await r.table('guilds').get(gid).toJSON().run(connection);
            if(guild == null) return false;
            return JSON.parse(guild).welcome;
        } catch(e) {
            console.log(e);
            return false; 
        }
    } else {
        return false;
    }
}

const getGoodbye = async function getGoodbye(gid) {
    if(gid) {
        try {
            var guild = await r.table('guilds').get(gid).toJSON().run(connection);
            if(guild == null) return false;
            return JSON.parse(guild).goodbye;
        } catch(e) {
            console.log(e);
            return false; 
        }
    } else {
        return false;
    }
}

const getAutorole = async function getAutorole(gid) {
    if(gid) {
        try {
            var guild = await r.table('guilds').get(gid).toJSON().run(connection);
            if(guild == null) return false;
            return JSON.parse(guild).autorole;
        } catch(e) {
            console.log(e);
            return false; 
        }
    } else {
        return false;
    }
}

const getLang = async function getLang(gid) {
    if(gid) {
        try {
            var guild = await r.table('guilds').get(gid).toJSON().run(connection);
            if(guild == null) return false;
            return JSON.parse(guild).lang;
        } catch(e) {
            console.log(e);
            return false; 
        }
    } else {
        return false;
    }
}

const getLvlToggle = async function getLvlToggle(gid) {
    if(gid) {
        try {
            var guild = await r.table('guilds').get(gid).toJSON().run(connection);
            if(guild == null) return false;
            let tr = JSON.parse(guild).lvlToggle;
            return tr == undefined ? {enabled: false} : tr;
        } catch(e) {
            console.log(e);
            return false; 
        }
    } else {
        return false;
    }
}

const addXP = async function addXP(user, guild, message) {
    const SManager = require("../strings/manager");
    const strings = await SManager.create(message.guild.id);
    if(user && guild) {
        try { 
            let msg = message.content.trim().split(/\s/).join('');
            if (msg.length < 6) return;
            if(message.author.bot) return;

            const g = await r.table('guilds').get(guild).toJSON().run(connection);
            const json = await JSON.parse(g);
            if (json.users) {
                const users = json.users;   
                    if(users[user]) {                
                        let us = users[user];

                        let xp = us.xp;
                        let lvl = us.lvl;
                        let lvlProm = us.lvlProm;

                        let newXP = Math.floor(Math.random() * Math.ceil(msg.length / 2)+3); 
                        let totalXP = xp + newXP;

                        if(totalXP >= lvlProm) {
                            totalXP = 0;
                            lvl++;
                            lvlProm = Math.floor(((lvlProm+newXP)*2)-(lvlProm-newXP)*0.70);
                            const lvltoggleget = await getLvlToggle(guild);
                            if (lvltoggleget.enabled == true) {
                                let embed = strings.getMsg("lvlup")
                                embed = embed.replace('#author#', `<@${message.author.id}>`)
                                        .replace('#lvl#', lvl);
                                await message.channel.send(embed);
                            }
                        }
                        await r.table('guilds').get(guild).update({
                            users: r.object(user, r.object('lvl', lvl, 'xp', totalXP, 'lvlProm', lvlProm))
                        }).run(connection);
                    } else {
                        await r.table('guilds').get(guild).update({
                            users: r.object(user, r.object('lvl', 1, 'xp', 0, 'lvlProm', 65))
                        }).run(connection);
                    }
            } else {
                await r.table('guilds').get(guild).update({users: { }}).run(connection);
                await r.table('guilds').get(guild).update({
                    users: r.object(user, r.object('lvl', 1, 'xp', 0, 'lvlProm', 65))
                }).run(connection);
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

const getTop = async function getTop(gid) {
    if(gid) {
        try {
            var guild = await r.table('guilds').get(gid).toJSON().run(connection);
            if(guild == null) return false;
            return JSON.parse(guild).users;
        } catch(e) {
            console.log(e);
            return false; 
        }
    } else {
        return false;
    }
}

exports.check = check;
exports.load = load;
exports.update = update;
exports.getPrefix = getPrefix;
exports.getUrls = getUrls;
exports.addUrl = addUrl;
exports.getVoiceBans = getVoiceBans;
exports.getWelcome = getWelcome;
exports.getGoodbye = getGoodbye;
exports.getAutorole = getAutorole;
exports.getLang = getLang;
exports.addXP = addXP;
exports.getLvlToggle = getLvlToggle;
exports.getTop = getTop;