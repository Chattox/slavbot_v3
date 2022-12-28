const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');
const { log } = require('console');

const reguser = {
  name: 'reguser',
  description:
    'creates a regular user object from given discord ID and adds to regular_users.json',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true, message)) {
      const logInfo = [
        'utility',
        message.author,
        'reguser',
        message.channel,
        args,
      ];
      if (args) {
        const user_id = args[0];
        // fetcher user object through guild to make sure user is on server command is given
        message.guild.members
          .fetch(user_id)
          .then((obj) => {
            const user = obj.user;
            // If user doesn't already exist, create regUser obj and write to file
            if (!regUsers.hasOwnProperty(user.id)) {
              regUsers[user.id] = {
                name: user.username,
                joinSound: 'none',
                leaveSound: 'none',
                twitchSound: 'none',
              };
              const formattedRegUsers = JSON.stringify(regUsers);
              fs.writeFile('./regular_users.json', formattedRegUsers, 'utf8')
                .then((res) => {
                  logger.info(
                    `${user.username} added to regular users`,
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
                `User ${user.username} already exists`,
                warnLogCtx(...logInfo)
              );
            }
          })
          .catch((err) => {
            logger.error(
              'Error fetching server member',
              errLogCtx(...logInfo, err)
            );
          });
      } else {
        logger.warn('No arguments given', warnLogCtx(...logInfo));
      }
    }
  },
};

module.exports = reguser;
