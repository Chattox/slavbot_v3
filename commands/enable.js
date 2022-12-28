const { loggers } = require('winston');
const commandList = require('../command_list.json');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const { infoLogCtx, warnLogCtx } = require('../utils/loggingContextHelpers');

const enable = {
  name: 'enable',
  description: 'enable a command to be used in slavbot',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true, message)) {
      const logInfo = [
        'utility',
        message.author,
        'enable',
        message.channel,
        args,
      ];
      if (args) {
        if (Object.keys(commandList).includes(args[0])) {
          commandList[args[0]] = true;
          const jsonCommandList = JSON.stringify(commandList);
          fs.writeFile('./command_list.json', jsonCommandList, 'utf8').then(
            () => {
              logger.info(
                `Command ${args[0]} has been enabled`,
                infoLogCtx(...logInfo)
              );
            }
          );
        } else {
          logger.warn(
            `${args[0]} is not a recognised command`,
            warnLogCtx(...logInfo)
          );
        }
      } else {
        logger.warn('No arguments given', warnLogCtx(...logInfo));
      }
    }
  },
};

module.exports = enable;
