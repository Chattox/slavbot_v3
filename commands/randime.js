const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

module.exports = {
  name: 'randime',
  description: 'plays a random anime sound',
  execute: message => {
    randSound([soundManifest.animeSounds], message);
  }
};
