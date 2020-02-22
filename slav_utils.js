const { client } = require('./slavmain.js');
const fs = require('fs').promises;

// Read through every sound file in the sounds folder and save their names to a manifest file so they can be used as commands and picked from randomly
const createSoundManifest = () => {
  fs.readdir('./sounds', { withFileTypes: true }).then(soundList => {
    console.log(
      `Found ${soundList.length} sounds, adding to manifest object...`
    );

    // Require in the manifest object we'll be changing
    const soundManifest = require('./sound_manifest');

    // Create and populate an array of sounds from sound folder that we'll be replacing the current manifest.regularsounds with
    const newSoundList = [];
    soundList.forEach(sound => {
      if (!sound.isDirectory()) {
        console.log(`Adding sound ${sound.name}`);
        newSoundList.push(sound.name.slice(0, -4));
      } else {
        console.log(`Skipping folder ${sound.name}`);
      }
    });
    soundManifest.regularSounds = newSoundList;

    // Convert into JSON object and write to file
    const jsonSoundManifest = JSON.stringify(soundManifest);
    fs.writeFile('./sound_manifest.json', jsonSoundManifest, 'utf8')
      .then(res => {
        console.log('File written!');
      })
      .catch(err => {
        console.log(err);
      });
  });
};

module.exports = { createSoundManifest };
