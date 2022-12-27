const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const { join } = require('path');
const { infoLogCtx, warnLogCtx } = require('../utils/loggingContextHelpers');

const regjoin = {
  name: 'regjoin',
  description:
    'updates the join sound for given reguser. Set to "none" to remove',
  execute: function (message, args, logger) {
    const logInfo = [
      'utility',
      message.author,
      'regjoin',
      message.channel,
      args,
    ];
    if (args) {
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
          fs.writeFile('./regular_users.json', jsonRegUsers, 'utf8').then(
            () => {
              logger.info(
                `User ${regUsers[userID].name} join sound updated to ${joinSound}`,
                infoLogCtx(...logInfo)
              );
            }
          );
        } else {
          logger.warn(
            `User ID or sound were not recognised. ID: ${userID}, Sound: ${joinSound}`,
            warnLogCtx(...logInfo)
          );
        }
      }
    } else {
      logger.warn('No arguments given', warnLogCtx(...logInfo));
    }
  },
};

module.exports = regjoin;
