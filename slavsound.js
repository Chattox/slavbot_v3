const { client } = require('./slavmain.js');

/* Plays a specific sound. Takes 2 args,
sound to find specific soundfile and message obj
 to join correct voice channel */
const playSound = async (sound, channel) => {
  try {
    const connection = await channel.join(); // TODO: remove error handling for this func from slavmain.
    const dispatcher = connection.play(`./sounds/${sound}.mp3`); // Have it all here instead.
    dispatcher.on('start', () => {
      console.log(`Playing "${sound}" in ${channel.name}...`);
    });
    dispatcher.on('finish', () => {
      console.log('Finished playing');
      connection.disconnect();
    });

    dispatcher.on('error', (error) => {
      //console.error;
      connection.disconnect();
    });
    return dispatcher;
  } catch (err) {
    if (
      err.message == 'You do not have permission to join this voice channel.'
    ) {
      console.log(
        `Could not join channel: ${channel.name} - do not have permission to join`
      );
    } else {
      console.log(err);
    }
  }
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
  playSound(randChoice, message);
};

module.exports = { playSound, randSound };
