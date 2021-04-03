const { isAdmin } = require('../utils/isAdmin');
const soundManifest = require('../sound_manifest.json');

const read = {
  name: 'read',
  description: 'Console logs the soundManifest object',
  execute: function (message) {
    if (isAdmin(message.author.id, true)) {
      console.log(soundManifest);
    }
  },
};

module.exports = read;
