const { createSoundManifest } = require('../slav_utils');
const { ADMIN_ID } = require('../config.json');

const create = {
  name: 'create',
  description:
    'creates the sound_manifest.regularSounds array from filenames in the ./sounds directory',
  isEnabled: true,
  execute: function(message) {
    if (this.isEnabled) {
      if (message.author.id === ADMIN_ID) {
        createSoundManifest();
      } else {
        console.log('----------');
        console.log('User is not admin');
        message.author.send('This command is for admins only, blyat');
        message.delete();
      }
    } else {
      console.log('----------');
      console.log('Command is disabled');
      message.author.send('This command is disabled!');
    }
  }
};

module.exports = create;
