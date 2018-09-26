const express = require('express');
const path = require('path');
const config = require("../config.json");
const app = express();
var bot = require("../index.js");
var usage = require('pidusage');

module.exports = () => {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/index.html'));
  });
  
  app.get('/panel', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'html/panel.html'));
  });

  app.get('/botstats', (req, res) => {
    usage(process.pid, (err, data) => {
      var ram = Math.floor(data.memory / 1024 / 1024);
      var totalSec = bot.client.uptime / 1000;
      var hours = Math.floor(totalSec / 3600);
      totalSec %= 3600;
      var mins = Math.floor(totalSec / 60);
      var secs = Math.floor(totalSec % 60);
      res.send({ping: Math.floor(bot.client.ping), ram: ram, cpu: Math.floor(data.cpu) + "%", users: bot.client.users.size, guilds: bot.client.guilds.size, channels: bot.client.channels.size, uptime:`${hours}h ${mins}m ${secs}s`, status: bot.client.user.presence.status});
    });
  });

  app.get('/invite', (req, res) => res.redirect('https://discordapp.com/oauth2/authorize?client_id=479612191767789573&scope=bot&permissions=493937759'));

  app.use('/api/discord', require('./api/discord'));
  
  app.listen(config.dashboard.port, () => {
    console.log(require("cli-colors").green('Dashboard uruchomiony na porcie ' + config.dashboard.port));
  });
  
  app.use((err, req, res, next) => {
      switch (err.message) {
        case 'NoCodeProvided':
          return res.status(400).send({
            status: 'ERROR',
            error: err.message,
          });
        default:
          return res.status(500).send({
            status: 'ERROR',
            error: err.message,
          });
      }
  }); 
}