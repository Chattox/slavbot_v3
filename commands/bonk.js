const { MessageReaction } = require('discord.js');
const { playSound } = require('../slavsound');
const { isAdmin } = require('../utils/isAdmin');
const { getVoiceConnection } = require('@discordjs/voice');
const { infoLogCtx, warnLogCtx } = require('../utils/loggingContextHelpers');

const bonk = {
  name: 'bonk',
  description: 'bonks a user into another channel',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true, message)) {
      const logInfo = [
        'utility',
        message.author,
        'bonk',
        message.channel,
        args,
      ];

      if (args.length !== 2) {
        logger.warn(
          'Wrong amount of arguments given, check and try again',
          warnLogCtx(...logInfo)
        );
        return;
      }
      const targetUserId = args[0];
      const destinationName = args[1].replace(/_/g, ' ');

      // Get user
      let user;
      user = message.guild.members.cache.get(targetUserId);
      if (!user) {
        logger.warn('User not found', warnLogCtx(...logInfo));
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
        logger.warn('Channel not found', warnLogCtx(...logInfo));
        return;
      }

      logger.info(
        `Bonking user ${user.displayName} to channel ${destination.name}`,
        infoLogCtx(...logInfo)
      );
      playSound('bonk', user.voice.channel, logger, false);
      const player = getVoiceConnection(message.guildId);
      player.on('destroyed', () => {
        setTimeout(() => {
          user.voice.setChannel(destination);
        }, 100);
      });
    }
  },
};

module.exports = bonk;
