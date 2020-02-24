const { client } = require('./slavmain.js');

/* Plays a specific sound. Takes 2 args,
sound to find specific soundfile and message obj
 to join correct voice channel */
const playSound = async (sound, message) => {
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    const dispatcher = connection.play(`./sounds/${sound}.mp3`);
    dispatcher.on('start', () => {
      console.log(
        `Playing "${sound}" in ${message.member.voice.channel.name}...`
      );
    });
    dispatcher.on('finish', () => {
      console.log('Finished playing');
      connection.disconnect();
    });

    dispatcher.on('error', console.error);
  }
};

/* Random sounds. Takes 2 args, array of sound lists 
from sound_manifest.json to pick a sound from, 
and msg obj to join correct voice channel */
const randSound = (soundLists, message) => {
  // Create new array that will contain all possible random sounds
  let randSounds = [];
  // Populate array with combination of regular and random only sound lists from sound_manifest.json
  randSounds = randSounds.concat(...soundLists);
  // Pick a random sound from the array and play
  randChoice = randSounds[Math.floor(Math.random() * randSounds.length)];
  playSound(randChoice, message);
};

module.exports = { playSound, randSound };
