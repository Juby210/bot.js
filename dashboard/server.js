const bodyParser = require("body-parser");
const url = require("url");
const express = require('express');
const path = require('path');
const config = require("../config.json");
const db = require('../util/db');
const app = express();

const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session)
const Strategy = require("passport-discord").Strategy;

app.use('/public', express.static(path.join(__dirname, 'public')));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new Strategy({
  clientID: config.dashboard.client_id,
  clientSecret: config.dashboard.client_secret,
  callbackURL: config.dashboard.callback_uri,
  scope: ["identify", "guilds"]
}, (accessToken, refreshToken, profile, done) => {
  process.nextTick(() => done(null, profile));
}));

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: "aaaaaaaaaaaaaaaaaaaaa",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.locals.domain = config.dashboard.domain;

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.backURL = req.url;
  res.redirect("/login");
}

const renderTemplate = (res, req, template, data = {}) => {
  const baseData = {
    client,
    path: req.path,
    user: req.isAuthenticated() ? req.user : null,
    strings: new (require("../strings/manager"))('en'),
    db
  };
  res.render(path.join(__dirname, "templates", template), Object.assign(baseData, data));
};

app.get("/login", (req, res, next) => {
  if (req.session.backURL) {
    req.session.backURL = req.session.backURL;
  } else if (req.headers.referer) {
    const parsed = url.parse(req.headers.referer);
    if (parsed.hostname === app.locals.domain) {
      req.session.backURL = parsed.path;
    }
  } else {
    req.session.backURL = "/";
  }
  next();
}, passport.authenticate("discord"));

app.get("/callback", passport.authenticate("discord", { failureRedirect: "/autherror" }), async (req, res) => {
  if (req.user.id == config.settings.ownerid || req.user.id == config.settings.devid) {
    req.session.isAdmin = true;
  } else {
    req.session.isAdmin = false;
  }
  if (req.session.backURL) {
    const url = req.session.backURL;
    req.session.backURL = null;
    res.redirect(url);
  } else {
    res.redirect("/");
  }
});

app.get("/logout", function (req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  renderTemplate(res, req, "index.ejs");
});
app.get("/devs", (req, res) => {
  renderTemplate(res, req, "devs.ejs");
});
app.get("/commands", (req, res) => {
  renderTemplate(res, req, "commands.ejs");
});

app.get("/autherror", (req, res) => {
  renderTemplate(res, req, "autherror.ejs");
});

app.get('/invite', (req, res) => res.redirect('https://discordapp.com/oauth2/authorize?client_id=' + client.user.id + '&scope=bot&permissions=8'));
app.get('/server', (req, res) => res.redirect('https://discord.gg/6bfpCCt'));

app.get('/panel', checkAuth, (req, res) => {
  renderTemplate(res, req, 'panel.ejs');
});

app.get('/admin', checkAuth, (req, res) => {
  if (!req.session.isAdmin) return res.redirect("/");
  renderTemplate(res, req, "admin.ejs");
});

app.get('/server/:sid', checkAuth, async (req, res) => {
  const g = client.guilds.get(req.params.sid);
  if(!g) return res.redirect('/panel');
  const perms = g.member(req.user.id) ? g.member(req.user.id).hasPermission("MANAGE_GUILD") : false;
  if(!perms && !req.session.isAdmin) res.redirect('/');
  renderTemplate(res, req, 'server/server.ejs', {g, prefix: await db.getPrefix(g.id), welcome: await db.getWelcome(g.id), goodbye: await db.getGoodbye(g.id), autorole: await db.getAutorole(g.id)});
});

module.exports = () => {
  app.listen(config.dashboard.port, () => {
    console.log(require("cli-colors").green('Dashboard running on port ' + config.dashboard.port));
  });
}