const { client } = require('../slavmain');
const { ADMIN_ID } = require('../config.json');

const stop = {
  name: 'stop',
  description: 'stops slavbot from playing whatever is currently playing',
  execute: message => {
    if (message.author.id === ADMIN_ID) {
      client.voice.connections.forEach(connection => {
        connection.disconnect();
      });
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
    }
  }
};

module.exports = stop;
