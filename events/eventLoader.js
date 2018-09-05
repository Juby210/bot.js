const event = (event) => require(`./${event}`);
module.exports = client => {
  client.on('ready', () => event('ready')(client));
  client.on('guildCreate', event('guildCreate'));
  client.on('guildDelete', event('guildDelete'));
  client.on('message', event('message'));
  client.on('err', event('error'));
};