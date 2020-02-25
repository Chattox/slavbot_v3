const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

module.exports = {
  name: 'rand',
  description:
    'plays a random sound chosen from a combined list of soundManifest.regularSounds and .randSounds',
  execute: message => {
    randSound([soundManifest.regularSounds, soundManifest.randSounds], message);
  }
};
