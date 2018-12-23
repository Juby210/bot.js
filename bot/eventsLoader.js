const rqEvent = (event) => require(`./events/${event}`);
module.exports = client => {
  client.on('ready', () => rqEvent('ready')(client));
  client.on('guildCreate', guild => rqEvent('guildCreate')(guild));
  //client.on('voiceStateUpdate', (oldMem, newMem) => rqEvent('voiceStateUpdate')(oldMem, newMem));
  client.on('message', message => rqEvent('message')(message, client));
  client.on('guildDelete', guild => rqEvent('guildDelete')(guild));
  client.on('error', err => rqEvent('error')(err));
  client.on('guildMemberAdd', member => rqEvent('guildMemberAdd')(member));
  client.on('guildMemberRemove', member => rqEvent('guildMemberRemove')(member));
};