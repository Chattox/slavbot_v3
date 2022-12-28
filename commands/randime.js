const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randime = {
  name: 'randime',
  description: 'plays a random anime sound',
  execute: function (message, args, logger) {
    randSound([soundManifest.randime], message.member.voice.channel, logger);
  },
};

module.exports = randime;
