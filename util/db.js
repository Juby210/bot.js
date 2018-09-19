const r = require('rethinkdb');

const { database } = require('../config.json');

let connection;
const load = async function load() {
    try {
        connection = await r.connect(database);
        console.log('Tworzenie tabeli.');
        await Promise.all([
            r.tableCreate("users").run(connection),
            r.tableCreate("guilds").run(connection),
            r.tableCreate("bot").run(connection)
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
                "id": gid,
                "prefix": "^",
                "users": []
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

const updateStats = async function update(g, c, u) {
    if(g && c && u){
        try {
            await r.table('bot').get(1).update({guilds: g, channels: c, users: u}).run(connection);
            return true;
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
            if (!pkt) {
                pkt = 10;
            }
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

                        let warnBlock = false, warnTime = null;
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

exports.updateStats = updateStats;
exports.check = check;
exports.load = load;
exports.update = update;
exports.getPrefix = getPrefix;
exports.warn = warn;