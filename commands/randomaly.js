const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randomaly = {
  name: 'randomaly',
  description: 'plays a random anomaly sound',
  execute: function(message) {
    randSound([soundManifest.anomalySounds], message.member.voice.channel);
  }
};

module.exports = randomaly;
