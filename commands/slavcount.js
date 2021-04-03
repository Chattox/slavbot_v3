const soundManifest = require('../sound_manifest.json');

const slavcount = {
  name: 'slavcount',
  description: 'Posts total number of slavsounds in chat',
  execute: function (message) {
    let count = 0;
    count += soundManifest.regularSounds.length;
    count += soundManifest.randSounds.length;
    console.log(`Total: ${count}`);
    message.channel.send(
      `There are a total of ${count} slavsounds.\n ${soundManifest.regularSounds.length} regular sounds\n ${soundManifest.randSounds.length} random only sounds`
    );
  },
};

module.exports = slavcount;
