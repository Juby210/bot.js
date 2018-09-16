const Discord = require('discord.js');
const client = new Discord.Client();
const rqEvent = (event) => require(`./${event}`);
module.exports = client => {
  client.on('ready', () => rqEvent('ready')(client));
  client.on('guildCreate', () => rqEvent('guildCreate')(guild));
  client.on('voiceStateUpdate', () => rqEvent('voiceStateUpdate')(oldMem, newMem));
};