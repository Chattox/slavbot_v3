const { createSoundManifest } = require('../utils/createSoundManifest');
const { ADMIN_ID } = require('../config.json');

const create = {
  name: 'create',
  description:
    'creates the sound_manifest.regularSounds array from filenames in the ./sounds directory',
  execute: function (message) {
    if (message.author.id === ADMIN_ID) {
      createSoundManifest();
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
    }
  },
};

module.exports = create;
