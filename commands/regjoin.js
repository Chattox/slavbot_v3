const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const { join } = require('path');

const regjoin = {
  name: 'regjoin',
  description:
    'updates the join sound for given reguser. Set to "none" to remove',
  execute: function (message, args) {
    const userID = args[0];
    const joinSound = args[1];
    if (isAdmin(message.author.id, true)) {
      if (
        joinSound === 'none' ||
        ((soundManifest.regularSounds.includes(joinSound) ||
          Object.keys(soundManifest).includes(joinSound)) &&
          Object.keys(regUsers).includes(userID))
      ) {
        regUsers[userID].joinSound = joinSound;
        const jsonRegUsers = JSON.stringify(regUsers);
        fs.writeFile('./regular_users.json', jsonRegUsers, 'utf8').then(() => {
          console.log(
            `User ${regUsers[userID].name} join sound updated to ${joinSound}`
          );
        });
      } else {
        console.log('----------');
        console.log('User ID or sound were not recognised');
        console.log(`User ID: ${userID}`);
        console.log(`Join sound: ${joinSound}`);
      }
    }
  },
};

module.exports = regjoin;
