const eventjs = (event) => require(`../events/${event}`);
module.exports = client => {
  client.on('ready', () => eventjs('ready')(client));
};
