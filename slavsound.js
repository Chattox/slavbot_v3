const { client } = require('./slavmain.js');

/* Plays a specific sound. Takes 2 args,
sound to find specific soundfile and message obj
 to join correct voice channel */
const playSound = async (sound, message) => {
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    const dispatcher = connection.play(`./sounds/${sound}.mp3`);
    dispatcher.on('start', () => {
      message.delete().then(msg => {
        console.log('Deleted command message');
      });
      console.log('playing!');
    });
    dispatcher.on('finish', () => {
      console.log('finished!');
      connection.disconnect();
    });

    dispatcher.on('error', console.error);
  }
};

/* Random sounds. Takes 2 args, array of sound lists 
from sound_manifest.json to pick a sound from, 
and msg obj to join correct voice channel */
const randSound = (soundLists, message) => {
  console.log(soundLists);
};

module.exports = { playSound, randSound };
