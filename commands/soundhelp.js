const soundManifest = require('../sound_manifest');

const soundHelp = {
  name: 'soundHelp',
  description: 'DMs user with a list of usable sound commands',
  execute: function(message) {
    let soundMsg = '';
    console.log(soundManifest.regularSounds);
    soundManifest.regularSounds.forEach(sound => {
      soundMsg += `\!${sound}\n`;
      if (soundMsg.length > 1900) {
        message.author.send(soundMsg);
        soundMsg = '';
      }
    });
    message.author.send(soundMsg);
  }
};

module.exports = soundHelp;
