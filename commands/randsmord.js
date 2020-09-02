const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randsmord = {
  name: 'randsmord',
  description: 'plays a random smord hype sound',
  execute: function (message) {
    randSound([soundManifest.smordHypeSounds], message.member.voice.channel);
  },
};

module.exports = randsmord;
