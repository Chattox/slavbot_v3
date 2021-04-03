const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');

const regleave = {
  name: 'regleave',
  description:
    'updates the leave sound for given reguser. Set to "none" to remove',
  execute: function (message, args) {
    if (args) {
      const userID = args[0];
      const leaveSound = args[1];
      if (isAdmin(message.author.id, true)) {
        if (
          leaveSound === 'none' ||
          (soundManifest.regularSounds.includes(leaveSound) &&
            Object.keys(regUsers).includes(userID))
        ) {
          regUsers[userID].leaveSound = leaveSound;
          const jsonRegUsers = JSON.stringify(regUsers);
          fs.writeFile('./regular_users.json', jsonRegUsers, 'utf8').then(
            () => {
              console.log(
                `User ${regUsers[userID].name} leave sound updated to ${leaveSound}`
              );
            }
          );
        } else {
          console.log('----------');
          console.log('User ID or sound were not recognised');
          console.log(`User ID: ${userID}`);
          console.log(`Leave sound: ${leaveSound}`);
        }
      }
    } else {
      console.log('----------');
      console.log('No arguments given!');
    }
  },
};

module.exports = regleave;
