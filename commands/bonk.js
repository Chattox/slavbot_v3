const { playSound } = require('../slavsound');
const { isAdmin } = require('../utils/isAdmin');

const bonk = {
  name: 'bonk',
  description: 'bonks a user into another channel',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      console.log('bonk');
    }
  },
};

module.exports = bonk;
