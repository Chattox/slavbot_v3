const { createSoundManifest } = require('../utils/createSoundManifest');
const { isAdmin } = require('../utils/isAdmin');

const create = {
  name: 'create',
  description:
    'creates the sound_manifest.regularSounds array from filenames in the ./sounds directory',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true)) {
      createSoundManifest(message, args, logger);
    }
  },
};

module.exports = create;
