const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randime = {
  name: 'randime',
  description: 'plays a random anime sound',
  execute: function(message) {
    randSound([soundManifest.animeSounds], message.member.voice.channel);
  }
};

module.exports = randime;
