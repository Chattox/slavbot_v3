const soundManifest = require('../sound_manifest.json');
const regUsers = require('../regular_users.json');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');

const regtwitch = {
  name: 'regtwitch',
  description:
    'updates the twitch alert sound for given reguser. Set to "none" to remove',
  execute: function (message, args, logger) {
    const logInfo = [
      'utility',
      message.author,
      'regtwitch',
      message.channel,
      args,
    ];
    if (args) {
      const userId = args[0];
      const twitchSound = args[1];
      if (isAdmin(message.author.id, true, message)) {
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
              logger.info(
                `User ${regUsers[userId].name} twitch alert sound updated to ${twitchSound}`,
                infoLogCtx(...logInfo)
              );
            })
            .catch((err) => {
              logger.error(
                'Error writing to regular_users.json',
                errLogCtx(...logInfo, err)
              );
            });
        } else {
          logger.warn(
            `User ID or sound were not recognised. ID: ${userId}, Sound: ${twitchSound}`,
            warnLogCtx(...logInfo)
          );
        }
      }
    } else {
      logger.warn('No arguments given', warnLogCtx(...logInfo));
    }
  },
};

module.exports = regtwitch;
