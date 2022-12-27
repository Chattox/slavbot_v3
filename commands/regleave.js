const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const { infoLogCtx, warnLogCtx } = require('../utils/loggingContextHelpers');

const regleave = {
  name: 'regleave',
  description:
    'updates the leave sound for given reguser. Set to "none" to remove',
  execute: function (message, args, logger) {
    const logInfo = [
      'utility',
      message.author,
      'regleave',
      message.channel,
      args,
    ];
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
              logger.info(
                `User ${regUsers[userID].name} leave sound updated to ${leaveSound}`,
                infoLogCtx(...logInfo)
              );
            }
          );
        } else {
          logger.warn(
            `User ID or sound were not recognised. ID: ${userID}, Sound: ${leaveSound}`,
            warnLogCtx(...logInfo)
          );
        }
      }
    } else {
      logger.warn('No arguments given', warnLogCtx(...logInfo));
    }
  },
};

module.exports = regleave;
