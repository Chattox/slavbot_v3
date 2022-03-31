const soundManifest = require('../sound_manifest');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');

const setrand = {
  name: 'setrand',
  description: 'toggles whether a sound is random only or not',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      if (args) {
        if (soundManifest.regularSounds.includes(args[0])) {
          soundManifest.regularSounds = soundManifest.regularSounds.filter(
            (sound) => sound !== args[0]
          );
          soundManifest.randsounds.push(args[0]);
          const jsonSoundManifest = JSON.stringify(soundManifest);
          fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
            .then((res) => {
              console.log(`'${args[0]}' has been set to random only!`);
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (soundManifest.randsounds.includes(args[0])) {
          soundManifest.randsounds = soundManifest.randsounds.filter(
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
        console.log('No arguments given!');
      }
    }
  },
};

module.exports = setrand;
