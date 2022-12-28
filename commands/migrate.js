const { getVoiceConnection } = require('@discordjs/voice');
const { User } = require('discord.js');
const { playSound } = require('../slavsound');
const { isAdmin } = require('../utils/isAdmin');
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');

const migrate = {
  name: 'migrate',
  description: 'moves all users from one channel to another',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true, message)) {
      const logInfo = [
        'utility',
        message.author,
        'migrate',
        message.channel,
        args,
      ];
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

        logger.info(
          `Moving all users from channel ${origin.name} to channel ${destination.name}`,
          infoLogCtx(...logInfo)
        );
        playSound('leeroy', origin, logger);
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
        logger.warn(
          'Incorrect arguments, needs origin and target channels',
          warnLogCtx(...logInfo)
        );
      }
    }
  },
};

module.exports = migrate;
