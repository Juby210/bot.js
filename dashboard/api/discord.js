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
var bot = require("../../index.js");
const db = require("../../util/db.js");

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20guilds&response_type=code&redirect_uri=${redirect}`);
});


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
            let objg = [];
            resp.forEach(async (srvv) => {
                if(bot.client.guilds.get(srvv.id)){
                    var prefix = await db.getPrefix(srvv.id);
                    if(prefix == false) prefix = config.settings.prefix;
                    objg.push({prefix: prefix, guild: srvv});
                }
            })
            setTimeout(() => res.send(objg), 10);
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
        rp("https://discordapp.com/api/users/@me", {
            headers: {
                Authorization: "Bearer " + req.cookies.token
            },
            json: true
        }).then(resp => {
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
            var prefix = await db.getPrefix(req.query.id);
            if(prefix == false) prefix = config.settings.prefix;
            res.send({prefix: prefix, guild: bot.client.guilds.get(req.query.id)});
        } else {
            res.status(404).send({status:"ERROR", message:"Guild not found"});
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
                rp("https://discordapp.com/api/users/@me", {
                    headers: {
                        Authorization: "Bearer " + req.cookies.token
                    },
                    json: true
                }).then(async resp => {
                    if(bot.client.guilds.get(req.query.id).ownerID != resp.id) {
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

module.exports = router;