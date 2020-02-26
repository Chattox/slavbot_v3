const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

module.exports = {
  name: 'randomaly',
  description: 'plays a random anomaly sound',
  execute: message => {
    randSound([soundManifest.anomalySounds], message);
  }
};
