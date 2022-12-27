const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randsmord = {
  name: 'randsmord',
  description: 'plays a random smord hype sound',
  execute: function (message, logger) {
    randSound([soundManifest.randsmord], message.member.voice.channel, logger);
  },
};

module.exports = randsmord;
