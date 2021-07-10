const { MessageReaction } = require('discord.js');
const { playSound } = require('../slavsound');
const { isAdmin } = require('../utils/isAdmin');

const bonk = {
  name: 'bonk',
  description: 'bonks a user into another channel',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      const targetUserId = args[0];
      const destinationName = args[1].replace(/_/g, ' ');

      // Get user
      let user = {};
      user = message.guild.members.cache.get(targetUserId);

      // Get destination channel
      let destination = {};
      message.guild.channels.cache.each((channel) => {
        if (channel.name.toLowerCase() === destinationName) {
          destination = channel;
        }
      });

      console.log('----------');
      console.log(user.voice.channel.name);
      console.log(`Bonking ${user.displayName} to ${destination.name}...`);
      playSound('bonk', user.voice.channel)
        .then((dispatcher) => {
          dispatcher.on('finish', () => {
            setTimeout(() => {
              user.voice.setChannel(destination);
            }, 500);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};

module.exports = bonk;
