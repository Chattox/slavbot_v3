const soundManifest = require('../sound_manifest');
const { randSound } = require('../slavsound');

const rand = {
  name: 'rand',
  description:
    'plays a random sound chosen from a combined list of regular and random-only sounds',
  isEnabled: true,
  execute: function(message) {
    if (this.isEnabled) {
      randSound(
        [soundManifest.regularSounds, soundManifest.randSounds],
        message
      );
    } else {
      console.log('----------');
      console.log('Command is disabled');
      message.author.send('This command is disabled!');
    }
  }
};

module.exports = rand;
