const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randomaly = {
  name: 'randomaly',
  description: 'plays a random anomaly sound',
  isEnabled: true,
  execute: function(message) {
    randSound([soundManifest.anomalySounds], message);
  }
};

module.exports = randomaly;
