const { randSound } = require('../slavsound');
const soundManifest = require('../sound_manifest');

const randgeralt = {
  name: 'randgeralt',
  description: 'plays a random geralt hmm or fuck',
  execute: function (message, args, logger) {
    randSound([soundManifest.randgeralt], message.member.voice.channel, logger);
  },
};

module.exports = randgeralt;
