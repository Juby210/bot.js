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
      var totalSec = global.client.uptime / 1000;
      var hours = Math.floor(totalSec / 3600);
      totalSec %= 3600;
      var mins = Math.floor(totalSec / 60);
      var secs = Math.floor(totalSec % 60);
      res.send({ping: Math.floor(global.client.ping), ram: ram, cpu: Math.floor(data.cpu) + "%", users: global.client.users.size, guilds: global.client.guilds.size, channels: global.client.channels.size, uptime:`${hours}h ${mins}m ${secs}s`, status: global.client.user.presence.status});
    });
  });

  app.get('/invite', (req, res) => res.redirect('https://discordapp.com/oauth2/authorize?client_id=' + global.client.user.id + '&scope=bot&permissions=493937759'));

  app.use('/api/dashboard', require('./api/dashboard'));
  app.use('/api/strings', require('./api/strings'));
  
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