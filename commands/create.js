const fs = require('fs').promises;
const { createSoundManifest } = require('../slav_utils');

module.exports = {
  name: 'create',
  description:
    'creates the sound_manifest.regularSounds array from filenames in the ./sounds directory',
  execute: () => {
    createSoundManifest();
  }
};
