const soundManifest = require('../sound_manifest.json');
const { infoLogCtx } = require('../utils/loggingContextHelpers');

const slavcount = {
  name: 'slavcount',
  description: 'Posts total number of slavsounds in chat',
  execute: function (message, args, logger) {
    const logInfo = [
      'utility',
      message.author,
      'slavcount',
      message.channel,
      args,
    ];
    let count = 0;
    count += soundManifest.regularSounds.length;
    count += soundManifest.randsounds.length;
    logger.info(`Total slav sounds: ${count}`, infoLogCtx(...logInfo));
    message.channel.send(
      `There are a total of ${count} slavsounds.\n ${soundManifest.regularSounds.length} regular sounds\n ${soundManifest.randsounds.length} random only sounds`
    );
  },
};

module.exports = slavcount;
