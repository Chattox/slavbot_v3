const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randomaly = {
  name: 'randomaly',
  description: 'plays a random anomaly sound',
  execute: function (message, args, logger) {
    randSound([soundManifest.randomaly], message.member.voice.channel, logger);
  },
};

module.exports = randomaly;
