const soundManifest = require('../sound_manifest.json');
const regUsers = require('../regular_users.json');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');

const regtwitch = {
  name: 'regtwitch',
  description:
    'updates the twitch alert sound for given reguser. Set to "none" to remove',
  execute: function (message, args) {
    if (args) {
      const userId = args[0];
      const twitchSound = args[1];
      if (isAdmin(message.author.id, true)) {
        if (
          twitchSound === 'none' ||
          ((soundManifest.regularSounds.includes(twitchSound) ||
            Object.keys(soundManifest).includes(twitchSound)) &&
            Object.keys(regUsers).includes(userId))
        ) {
          regUsers[userId].twitchSound = twitchSound;
          const regUsersJson = JSON.stringify(regUsers);
          fs.writeFile('./regular_users.json', regUsersJson, 'utf8')
            .then(() => {
              console.log(
                `User ${regUsers[userId].name} twitch alert sound updated to ${twitchSound}`
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log('----------');
          console.log('User ID or sound were not recognised');
          console.log(`User ID: ${userId}`);
          console.log(`Twitch sound: ${twitchSound}`);
        }
      }
    } else {
      console.log('----------');
      console.log('No arguments given!');
    }
  },
};

module.exports = regtwitch;
