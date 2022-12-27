const { isAdmin } = require('../utils/isAdmin');
const soundManifest = require('../sound_manifest.json');
const { infoLogCtx } = require('../utils/loggingContextHelpers');

const read = {
  name: 'read',
  description: 'Console logs the soundManifest object',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true)) {
      const logInfo = [
        'utility',
        message.author,
        'read',
        message.channel,
        args,
      ];
      console.log(soundManifest);
      logger.info(
        'This is a test function. Testy test test',
        infoLogCtx(...logInfo)
      );
    }
  },
};

module.exports = read;
