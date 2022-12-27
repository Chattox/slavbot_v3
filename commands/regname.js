const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const {
  infoLogCtx,
  errLogCtx,
  warnLogCtx,
} = require('../utils/loggingContextHelpers');

const regname = {
  name: 'regname',
  description: 'updates the name property of existing regular user object',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true)) {
      const logInfo = [
        'utility',
        message.author,
        'regname',
        message.channel,
        args,
      ];
      if (args) {
        if (regUsers[args[0]]) {
          const oldName = regUsers[args[0]].name;
          regUsers[args[0]].name = args[1];
          const formattedRegUsers = JSON.stringify(regUsers);
          fs.writeFile('./regular_users.json', formattedRegUsers, 'utf8')
            .then((res) => {
              logger.info(
                `User ${oldName} updated to ${regUsers[args[0]].name}`,
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
            `User at ID ${args[0]} is not a regular user`,
            warnLogCtx(...logInfo)
          );
        }
      } else {
        logger.warn('No arguments given', warnLogCtx(...logInfo));
      }
    }
  },
};

module.exports = regname;
