const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const rand = {
  name: 'rand',
  description:
    'plays a random sound chosen from a combined list of regular and random-only sounds',
  execute: function (message, logger) {
    randSound(
      [soundManifest.regularSounds, soundManifest.randsounds],
      message.member.voice.channel,
      logger
    );
  },
};

module.exports = rand;
