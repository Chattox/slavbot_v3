const { getVoiceConnection } = require('@discordjs/voice');
const { User } = require('discord.js');
const { playSound } = require('../slavsound');
const { isAdmin } = require('../utils/isAdmin');

const migrate = {
  name: 'migrate',
  description: 'moves all users from one channel to another',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      if (args && args.length === 2) {
        const originName = args[0].replace(/_/g, ' ');
        const destinationName = args[1].replace(/_/g, ' ');
        let origin = {};
        let destination = {};
        // Use each to find and set channel by name because I can't get .find() to work
        message.guild.channels.cache.each((channel) => {
          if (channel.name.toLowerCase() === originName) {
            origin = channel;
          } else if (channel.name.toLowerCase() === destinationName) {
            destination = channel;
          }
        });

        console.log('----------');
        console.log(
          `Moving all users from ${origin.name} to ${destination.name}...`
        );
        playSound('leeroy', origin);
        const player = getVoiceConnection(message.guildId);
        player.on('destroyed', () => {
          setTimeout(() => {
            origin.members.forEach((member) => {
              if (!member.user.bot) {
                member.voice.setChannel(destination);
              }
            });
          }, 100);
        });
      } else {
        console.log('----------');
        console.log('Incorrect arguments! Needs origin and target channels');
      }
    }
  },
};

module.exports = migrate;
