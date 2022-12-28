const soundManifest = require('../sound_manifest');

const help = {
  name: 'help',
  description: 'DMs user with a list of usable sound commands',
  execute: function (message, args, logger) {
    let soundMsg = '';
    soundManifest.regularSounds.forEach((sound) => {
      soundMsg += `\!${sound}\n`;
      if (soundMsg.length > 1900) {
        message.author.send(soundMsg);
        soundMsg = '';
      }
    });
    message.author.send(soundMsg);
  },
};

module.exports = help;
