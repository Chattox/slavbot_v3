const soundManifest = require('../sound_manifest');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');

const setrand = {
  name: 'setrand',
  description: 'toggles whether a sound is random only or not',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true, message)) {
      const logInfo = [
        'utility',
        message.author,
        'setrand',
        message.channel,
        args,
      ];
      if (args) {
        if (soundManifest.regularSounds.includes(args[0])) {
          soundManifest.regularSounds = soundManifest.regularSounds.filter(
            (sound) => sound !== args[0]
          );
          soundManifest.randsounds.push(args[0]);
          const jsonSoundManifest = JSON.stringify(soundManifest);
          fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
            .then((res) => {
              logger.info(
                `${args[0]} has been set to random only`,
                infoLogCtx(...logInfo)
              );
            })
            .catch((err) => {
              logger.error(
                'Error writing to sound_manifest.json',
                errLogCtx(...logInfo, err)
              );
            });
        } else if (soundManifest.randsounds.includes(args[0])) {
          soundManifest.randsounds = soundManifest.randsounds.filter(
            (sound) => sound !== args[0]
          );
          soundManifest.regularSounds.push(args[0]);
          const jsonSoundManifest = JSON.stringify(soundManifest);
          fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
            .then((res) => {
              logger.info(
                `${args[0]} has been removed from random only`,
                infoLogCtx(...logInfo)
              );
            })
            .catch((err) => {
              logger.error(
                'Error writing to sound_manifest.json',
                errLogCtx(...logInfo, err)
              );
            });
        } else {
          logger.warn(
            `${args[0]} was not found in either regular or random only sound lists`,
            warnLogCtx(...logInfo)
          );
          message.author.send(
            `'${args[0]}' was not found in either regular or random only sound lists!`
          );
        }
      } else {
        logger.warn('No arguments given', warnLogCtx(...logInfo));
      }
    }
  },
};

module.exports = setrand;
