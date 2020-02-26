const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

module.exports = {
  name: 'rand',
  description:
    'plays a random sound chosen from a combined list of regular and random-only sounds',
  execute: message => {
    randSound([soundManifest.regularSounds, soundManifest.randSounds], message);
  }
};
