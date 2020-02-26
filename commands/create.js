const fs = require('fs').promises;
const { createSoundManifest } = require('../slav_utils');
const { ADMIN_ID } = require('../config.json');

module.exports = {
  name: 'create',
  description:
    'creates the sound_manifest.regularSounds array from filenames in the ./sounds directory',
  execute: message => {
    if (message.author.id === ADMIN_ID) {
      createSoundManifest();
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
      message.delete();
    }
  }
};
