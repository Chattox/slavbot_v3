const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');

const addrand = {
  name: 'addrand',
  description: 'add sounds to specific random lists',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      if (args) {
        const soundManifest = require('../sound_manifest.json');
        const target = args[0];
        const targetList = soundManifest[target];
        const sound = args[1];

        // First check if the target list is randSounds, because that's what setRand is for
        if (target === 'randsounds') {
          console.log('----------');
          console.log(
            'To set a sound as random only, use setrand as this is for adding to rand lists'
          );
          return false;
        }

        if (soundManifest.regularSounds.includes(sound)) {
          if (targetList === undefined) {
            console.log('----------');
            console.log(`Random list '${target}' not found!`);
            return false;
          } else if (targetList.includes(sound)) {
            console.log('----------');
            console.log(`${sound} already exists in ${target}!`);
            return false;
          }

          targetList.push(sound);
          const jsonSoundManifest = JSON.stringify(soundManifest);
          fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
            .then((res) => {
              console.log(`'${sound}' has been added to ${target}!`);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log('----------');
          console.log(`${sound} is not currently in the sound manifest!`);
          return false;
        }
      } else {
        console.log('----------');
        console.log('No arguments given!');
      }
    }
  },
};

module.exports = addrand;
