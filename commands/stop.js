const { client } = require('../slavmain');
const { isAdmin } = require('../utils/isAdmin');
const { getVoiceConnections } = require('@discordjs/voice');

const stop = {
  name: 'stop',
  description: 'stops slavbot from playing whatever is currently playing',
  execute: (message) => {
    if (isAdmin(message.author.id, true, message)) {
      getVoiceConnections().forEach((connection) => {
        connection.destroy();
      });
    }
  },
};

module.exports = stop;
