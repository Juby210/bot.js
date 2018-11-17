const r = require('rethinkdb');
const config = require("../config.json");
const { database } = require('../config.json');

let connection;
const load = async function load() {
    try {
        connection = await r.connect(database);
        console.log('Tworzenie tabeli.');
        await Promise.all([
            r.tableCreate("users").run(connection),
            r.tableCreate("guilds").run(connection)
        ]);
        console.log('Tabele zostaly stworzone.');
    } catch(error) {
        if (error.message.includes('tabele juz sa')) {
            console.log('Tabele juz sa w bazie.');
        } else {
            console.error(error);
        }
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

const warn = async function warn(user, guildID, pkt, reason) {
    if(user && guildID && pkt && reason) {
        try {
            if (!reason) {
                reason = 'Nie podano powodu.';
            }
            const gi = await r.table('guilds').get(guildID).toJSON().run(connection);
            
            const json = await JSON.parse(gi);
            if (json.users) {
                const users = json.users;   
                    if(users[user]) {                
                        let us = users[user];

                        let warns = us.warns;
                        let warnReasons = us.warnreasons + ' | ' + reason;

                        let warnBlock = false;
                        await r.table('guilds').get(guildID).update({
                            users: r.object(user, r.object('warns', 'warnreasons', warnReasons, 'warnblock', warnBlock))
                        }).run(connection);
                    } else {
                        await r.table('guilds').get(guildID).update({
                            users: r.object(user, r.object('warns', 'warnreasons', warnReasons, 'warnblock', warnBlock))
                        }).run(connection);
                    }
            } else {
                await r.table('guilds').get(guildID).update({users: { }}).run(connection);
                await r.table('guilds').get(guildID).update({
                    users: r.object(user, r.object('warns', 'warnreasons', warnReasons, 'warnblock', warnBlock))
                }).run(connection);
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

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

exports.check = check;
exports.load = load;
exports.update = update;
exports.getPrefix = getPrefix;
exports.warn = warn;
exports.getUrls = getUrls;
exports.addUrl = addUrl;
exports.getVoiceBans = getVoiceBans;
exports.getWelcome = getWelcome;
exports.getGoodbye = getGoodbye;
exports.getAutorole = getAutorole;
exports.getLang = getLang;