const { MessageReaction } = require('discord.js');
const { playSound } = require('../slavsound');
const { isAdmin } = require('../utils/isAdmin');

const bonk = {
  name: 'bonk',
  description: 'bonks a user into another channel',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      if (args.length !== 2) {
        console.log('Wrong amount of arguments! Check and try again');
        return;
      }
      const targetUserId = args[0];
      const destinationName = args[1].replace(/_/g, ' ');

      // Get user
      let user;
      user = message.guild.members.cache.get(targetUserId);
      if (!user) {
        console.log('----------');
        console.log('User not found!');
        return;
      }

      // Get destination channel
      let destination;
      message.guild.channels.cache.each((channel) => {
        if (channel.name.toLowerCase() === destinationName) {
          destination = channel;
        }
      });
      if (!destination) {
        console.log('----------');
        console.log('Channel not found!');
        return;
      }

      console.log('----------');
      console.log(`Bonking ${user.displayName} to ${destination.name}...`);
      playSound('bonk', user.voice.channel)
        .then((dispatcher) => {
          dispatcher.on('finish', () => {
            setTimeout(() => {
              user.voice.setChannel(destination);
            }, 100);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};

module.exports = bonk;
