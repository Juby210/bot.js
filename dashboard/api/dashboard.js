const express = require('express');
const router = express.Router();
const config = require("../../config.json");
const CLIENT_ID = config.dashboard.client_id;
const CLIENT_SECRET = config.dashboard.client_secret;
const redirect = encodeURIComponent(config.dashboard.callback_uri);
const btoa = require('btoa');
const util = require("util");
const cookie = require("cookie-parser");
const rp = require("request-promise");
var bot = require("../..");
const db = require("../../util/db");
var stringify = require('json-stringify-safe');

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds&response_type=code&redirect_uri=${redirect}`);
});

function getuser(token) {
    return new Promise((resolve, reject) => {
        rp("https://discordapp.com/api/users/@me", {
            headers: {
                Authorization: "Bearer " + token
            },
            json: true
        }).then(resp => {
            resolve(resp);
        }).catch(err => reject(err));
    });
}

function getperms(gid, userid) {
    if(bot.client.guilds.get(gid).member(userid).hasPermission("ADMINISTRATOR") || bot.client.guilds.get(gid).member(userid).hasPermission("MANAGE_GUILD")) {
        return true;
    } else {
        return false;
    }
}

router.get('/callback', async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    rp({
        method: 'POST',
        headers: {
          Authorization: `Basic ${creds}`,
        },
        uri:`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        json: true
    }).then(response => {
        res.cookie('token', response.access_token, {
            maxAge: 1000 * 60 * 60 * 24 * 3
        });
        res.redirect(`/panel`);
    });
});

router.use(cookie())
router.get('/guilds', async (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        rp("https://discordapp.com/api/users/@me/guilds", {
            headers: {
                Authorization: "Bearer " + req.cookies.token
            },
            json: true
        }).then(async resp => {
            var zr = 0;
            let objg = [];
            resp.forEach(async (srvv) => {
                if(bot.client.guilds.get(srvv.id)){
                    await db.getPrefix(srvv.id).then(prefix => {
                        getuser(req.cookies.token).then(user => {
                            if(prefix == false) prefix = config.settings.prefix;
                            zr += 1;
                            objg.push({prefix: prefix, perms: getperms(srvv.id, user.id), guild: srvv});
                            if(zr == resp.length) res.send(objg);
                        });
                    });
                } else zr += 1;
                if(zr == resp.length) setTimeout(() => res.send(objg), 20);
            });
        }).catch(err => {
            throw new Error(err.message);
        });
    } else {
        notlogged(res);
    }
})
router.get('/user', (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        getuser(req.cookies.token).then(resp => {
            res.send({status: "OK", user: resp});
        }).catch(() => notlogged(res));
    } else {
        notlogged(res);
    }
})
router.get('/guild', async (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        if(bot.client.guilds.get(req.query.id)) {
            await db.getPrefix(req.query.id).then(async prefix => {
                if(prefix == false) prefix = config.settings.prefix;
                await db.getWelcome(req.query.id).then(async welcome => {
                    if(welcome == undefined || welcome == false) welcome = {enabled: false, channel: "", msg: ""};
                    await db.getAutorole(req.query.id).then(async autorole => {
                        if(autorole == undefined || autorole == false) autorole = {enabled: false, role: ""};
                        await db.getVoiceBans(req.query.id).then(voiceban => {
                            if(voiceban == undefined || voiceban == false) voiceban = [];
                            rp("https://discordapp.com/api/guilds/" + req.query.id, {
                                method: 'GET',
                                headers: {
                                    Authorization: `Bot ${bot.client.token}`,
                                },
                                json: true
                            }).then(resp => {
                                res.send({prefix: prefix, welcome: welcome, autorole: autorole, voicebans: voiceban, guild: resp});
                            });
                        });
                    });
                });
            });
        } else {
            res.status(404).send({status:"ERROR", message:"Guild not found"});
        }
    } else {
        notlogged(res);
    }
})
router.get('/channel', async (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        if(bot.client.channels.get(req.query.id)) {
            res.send(stringify(bot.client.channels.get(req.query.id)));
        } else {
            res.status(404).send({status:"ERROR", message:"Channel not found"});
        }
    } else {
        notlogged(res);
    }
})
router.get('/prefix', async (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        if(bot.client.guilds.get(req.query.id)) {
            if(req.query.prefix == undefined) {
                res.status(404).send({status:"ERROR", message:"Prefix"})
            } else {
                getuser(req.cookies.token).then(async user => {
                    if(!getperms(req.query.id, user.id)) {
                        res.send({status:"ERROR", message:"Nie masz uprawnien"});
                    } else {
                        await db.update('guilds', req.query.id, 'prefix', req.query.prefix);
                        res.send({status:"OK"});
                    }
                }).catch(() => notlogged(res));
            }
        } else {
            res.status(404).send({status:"ERROR", message:"Guild not found"});
        }
    } else {
        notlogged(res);
    }
})
router.get('/welcome', async (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        getuser(req.cookies.token).then(async user => {
            if(!getperms(req.query.id, user.id)) {
                res.send({status:"ERROR", message:"Nie masz uprawnien"});
            } else {
                await db.update('guilds', req.query.id, 'welcome', {enabled: strToBool(req.query.enabled), channel: req.query.channel, msg: req.query.msg.replace(new RegExp("3ee3", "g"), "#")});
                res.send({status:"OK"});
            }
        }).catch(() => notlogged(res));
    } else {
        notlogged(res);
    }
})
router.get('/welcomechannel', async (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        getuser(req.cookies.token).then(async user => {
            if(!getperms(req.query.id, user.id)) {
                res.send({status:"ERROR", message:"Nie masz uprawnien"});
            } else {
                var zn = false;
                bot.client.guilds.get(req.query.id).channels.forEach(async ch => {
                    if(zn) return;
                    if(ch.name.toLowerCase().includes(req.query.channel.toLowerCase())) {
                        zn = true;
                        await db.getWelcome(req.query.id).then(async welcome => {
                            if(welcome == undefined || welcome == false) welcome = {enabled: false, channel: "", msg: ""};
                            welcome.channel = ch.id;
                            await db.update('guilds', req.query.id, 'welcome', welcome);
                        });
                        res.send({status: "OK", channel: ch.id, name: ch.name});
                    }
                });
                setTimeout(() => {
                    if(!zn) res.send({status:"ERROR", message:"Nie znaleziono takiego kanału"});
                }, 10);
            }
        }).catch(() => notlogged(res));
    } else {
        notlogged(res);
    }
})
router.get('/autorole', async (req, res) => {
    if(!util.isUndefined(req.cookies)) {
        if(util.isUndefined(req.cookies.token)) return notlogged(res);
        getuser(req.cookies.token).then(async user => {
            if(!getperms(req.query.id, user.id)) {
                res.send({status:"ERROR", message:"Nie masz uprawnien"});
            } else {
                if(strToBool(req.query.enabled)) {
                    var zn = false;
                    bot.client.guilds.get(req.query.id).roles.forEach(async r => {
                        if(zn) return;
                        if(r.name.toLowerCase().includes(req.query.role.toLowerCase())) {
                            zn = true;
                            await db.update('guilds', req.query.id, 'autorole', {enabled: true, role: r.id});
                            res.send({status:"OK"});
                        }
                    });
                    setTimeout(() => {
                        if(!zn) res.send({status:"ERROR", message:"Nie znaleziono takiej roli"});
                    }, 10);
                } else {
                    await db.update('guilds', req.query.id, 'autorole', {enabled: false, role: ""});
                    res.send({status:"OK"});
                }
            }
        }).catch(() => notlogged(res));
    } else {
        notlogged(res);
    }
})

router.get('/logout', (req, res) => {
    rp({
        method: 'POST',
        uri: 'https://discordapp.com/api/oauth2/token/revoke?token=' + req.cookies.token,
    });
    res.clearCookie('token');
    res.redirect('/');
})

function notlogged(res) {
    res.status(401).send({status: "ERROR", message:"Not logged in"});
}

function strToBool(s)
{
    regex=/^\s*(true|1|on)\s*$/i
    return regex.test(s);
}

module.exports = router;