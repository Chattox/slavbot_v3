const soundManifest = require('../sound_manifest');
const fs = require('fs').promises;
const { ADMIN_ID } = require('../config.json');

const setrand = {
  name: 'setrand',
  description: 'toggles whether a sound is random only or not',
  execute: function (message, args) {
    if (message.author.id === ADMIN_ID) {
      if (soundManifest.regularSounds.includes(args[0])) {
        soundManifest.regularSounds = soundManifest.regularSounds.filter(
          (sound) => sound !== args[0]
        );
        soundManifest.randSounds.push(args[0]);
        const jsonSoundManifest = JSON.stringify(soundManifest);
        fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
          .then((res) => {
            console.log(`'${args[0]}' has been set to random only!`);
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (soundManifest.randSounds.includes(args[0])) {
        soundManifest.randSounds = soundManifest.randSounds.filter(
          (sound) => sound !== args[0]
        );
        soundManifest.regularSounds.push(args[0]);
        const jsonSoundManifest = JSON.stringify(soundManifest);
        fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
          .then((res) => {
            console.log(`'${args[0]}' has been removed from random only!`);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log(
          `'${args[0]}' was not found in either regular or random only sound lists!`
        );
        message.author.send(
          `'${args[0]}' was not found in either regular or random only sound lists!`
        );
      }
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
    }
  },
};

module.exports = setrand;
