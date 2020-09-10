const { createSoundManifest } = require('../utils/createSoundManifest');
const { isAdmin } = require('../utils/isAdmin');

const create = {
  name: 'create',
  description:
    'creates the sound_manifest.regularSounds array from filenames in the ./sounds directory',
  execute: function (message) {
    if (isAdmin(message, true)) {
      createSoundManifest();
    }
  },
};

module.exports = create;
