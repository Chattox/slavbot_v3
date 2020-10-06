const { randSound } = require('../slavsound');
const soundManifest = require('../sound_manifest');

const randgeralt = {
  name: 'randgeralt',
  description: 'plays a random geralt hmm or fuck',
  execute: function (message) {
    randSound([soundManifest.randgeralt], message.member.voice.channel);
  },
};

module.exports = randgeralt;
