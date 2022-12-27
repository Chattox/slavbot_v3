const fs = require('fs').promises;
const { infoLogCtx, errLogCtx } = require('../utils/loggingContextHelpers');

// Read through every sound file in the sounds folder and save their names to a manifest file so they can be used as commands and picked from randomly
const createSoundManifest = (message, args, logger) => {
  const logInfo = [
    'util function',
    message.author,
    'createSoundManifest',
    message.channel,
    args,
  ];
  fs.readdir(__dirname + '/../sounds', { withFileTypes: true }).then(
    (soundList) => {
      logger.info(
        `Found ${soundList.length} sounds, adding to manifest object`,
        infoLogCtx(...logInfo)
      );

      // Require in the manifest object we'll be changing
      const soundManifest = require('../sound_manifest');

      // Create and populate an array of sounds from sound folder that we'll be replacing the current manifest.regularsounds with
      const newSoundList = [];
      const soundLoggingList = [];
      soundList.forEach((sound) => {
        // Check if the entry is a folder, if it is, skip it. If it's a file, add its name to the array
        if (!sound.isDirectory()) {
          const soundName = sound.name.slice(0, -4);
          if (soundManifest.randsounds.includes(soundName)) {
            soundLoggingList.push({ [sound.name.slice(0, -4)]: 'randomOnly' });
          } else {
            logger.info(`Adding sound ${sound.name}`, infoLogCtx(...logInfo));
            soundLoggingList.push({ [sound.name.slice(0, -4)]: 'added' });
            newSoundList.push(sound.name.slice(0, -4));
          }
        } else {
          soundLoggingList.push({ [sound.name]: 'folder' });
        }
      });
      logger.info('Sound manifest object created', {
        ...infoLogCtx(...logInfo),
        soundManifest: soundLoggingList,
      });
      soundManifest.regularSounds = newSoundList;

      // Convert into JSON object and write to file
      const jsonSoundManifest = JSON.stringify(soundManifest);
      fs.writeFile(
        __dirname + '/../sound_manifest.json',
        jsonSoundManifest,
        'utf8'
      )
        .then((res) => {
          logger.info('sound_manifest.json written', infoLogCtx(...logInfo));
        })
        .catch((err) => {
          logger.error(
            'Error writing sound_manifest.json',
            errLogCtx(...logInfo, err)
          );
        });
    }
  );
};

module.exports = { createSoundManifest };
