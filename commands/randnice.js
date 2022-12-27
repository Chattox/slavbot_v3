const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randnice = {
  name: 'randnice',
  description: 'plays a random "nice" sound',
  execute: function (message, logger) {
    randSound([soundManifest.randnice], message.member.voice.channel, logger);
  },
};

module.exports = randnice;
