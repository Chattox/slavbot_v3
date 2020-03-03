const { randSound } = require('../slavsound');
const soundManifest = require('../sound_manifest');

const geralt = {
  name: 'geralt',
  description: 'plays a random geralt hmm or fuck',
  execute: function(message) {
    randSound([soundManifest.geraltSounds], message.member.voice.channel);
  }
};

module.exports = geralt;
