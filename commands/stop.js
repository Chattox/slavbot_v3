const { client } = require('../slavmain');
const { isAdmin } = require('../utils/isAdmin');

const stop = {
  name: 'stop',
  description: 'stops slavbot from playing whatever is currently playing',
  execute: (message) => {
    if (isAdmin(message.author.id, true)) {
      client.voice.connections.forEach((connection) => {
        connection.disconnect();
      });
    }
  },
};

module.exports = stop;
