const { ADMIN_ID } = require('../config.json');

const slavcount = {
  name: 'slavcount',
  description: 'Posts total number of slavsounds in chat',
  execute: function (message, args) {
    let count = 0;
    count += args.regularSounds.length;
    count += args.randSounds.length;
    console.log(`Total: ${count}`);
    message.channel.send(
      `There are a total of ${count} slavsounds.\n ${args.regularSounds.length} regular sounds\n ${args.randSounds.length} random only sounds`
    );
  },
};

module.exports = slavcount;
