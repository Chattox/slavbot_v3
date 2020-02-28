const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const randime = {
  name: 'randime',
  description: 'plays a random anime sound',
  isEnabled: true,
  execute: function(message) {
    if (this.isEnabled) {
      randSound([soundManifest.animeSounds], message);
    } else {
      console.log('----------');
      console.log('Command is disabled');
      message.author.send('This command is disabled!');
    }
  }
};

module.exports = randime;
