const { isAdmin } = require('../utils/isAdmin');
const { infoLogCtx } = require('../utils/loggingContextHelpers');

const readuser = {
  name: 'readuser',
  description:
    'Console logs the activities of the user object of the given ID. If no ID given, logs the author',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true)) {
      const logInfo = [
        'utility',
        message.author,
        'readuser',
        message.channel,
        args,
      ];
      // check if args is an ID
      if (args && typeof args[0] === 'string') {
        console.log(
          message.guild.members.cache.get(args.toString()).presence?.activities
        );
      } else {
        console.log(message.author.presence?.activities);
      }
      logger.info(
        'This is a test function. Testy test test',
        infoLogCtx(...logInfo)
      );
    }
  },
};

module.exports = readuser;
