const { client } = require('./slavmain.js');

/* Plays a specific sound. Takes 2 args,
sound to find specific soundfile and message obj
 to join correct voice channel */
const playSound = async (sound, channel) => {
  const connection = await channel.join();
  const dispatcher = connection.play(`./sounds/${sound}.mp3`);
  dispatcher.on('start', () => {
    console.log(`Playing "${sound}" in ${channel.name}...`);
  });
  dispatcher.on('finish', () => {
    console.log('Finished playing');
    connection.disconnect();
  });

  dispatcher.on('error', console.error);
  return dispatcher;
};

// For users joining/leaving channels, same as playSound but takes voiceStateUpdate obj instead of message

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
  playSound(randChoice, message).catch((err) => console.log(err));
};

module.exports = { playSound, randSound };
