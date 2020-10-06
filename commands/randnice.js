const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randnice = {
  name: 'randnice',
  description: 'plays a random "nice" sound',
  execute: function (message) {
    randSound([soundManifest.niceSounds], message.member.voice.channel);
  },
};

module.exports = randnice;
