const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');

const addrand = {
  name: 'addrand',
  description: 'add sounds to specific random lists',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true)) {
      if (args) {
        const soundManifest = require('../sound_manifest.json');
        const target = args[0];
        const targetList = soundManifest[target];
        const sound = args[1];

        const logInfo = [
          'utility',
          message.author,
          'addrand',
          message.channel,
          args,
        ];

        // First check if the target list is randSounds, because that's what setRand is for
        if (target === 'randsounds') {
          logger.warn(
            'To set a sound as random only, use setrand as addrand is for adding to rand lists',
            warnLogCtx(...logInfo)
          );
          return false;
        }

        if (soundManifest.regularSounds.includes(sound)) {
          if (targetList === undefined) {
            logger.warn(
              `Random list ${target} not found`,
              warnLogCtx(...logInfo)
            );
            return false;
          } else if (targetList.includes(sound)) {
            logger.warn(
              `Sound ${sound} already exists in list ${target}`,
              warnLogCtx(...logInfo)
            );
            return false;
          }

          targetList.push(sound);
          const jsonSoundManifest = JSON.stringify(soundManifest);
          fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
            .then((res) => {
              logger.info(
                `Sound ${sound} has been added to list ${target}`,
                infoLogCtx(...logInfo)
              );
            })
            .catch((err) => {
              logger.error(`Error writing to file`, {
                ...errLogCtx(...logInfo),
                error: err,
              });
            });
        } else {
          logger.warn(
            `Cannot add sound ${sound}; not found in sound manifest`,
            warnLogCtx(...logInfo)
          );
          return false;
        }
      } else {
        logger.warn(
          `Cannot add sound to randlist; no arguments given`,
          warnLogCtx(...logInfo)
        );
      }
    }
  },
};

module.exports = addrand;
