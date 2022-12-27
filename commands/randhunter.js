const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randhunter = {
  name: 'randhunter',
  description: 'plays a random Witch It hunter sound',
  execute: function (message, args, logger) {
    randSound([soundManifest.randhunter], message.member.voice.channel, logger);
  },
};

module.exports = randhunter;
