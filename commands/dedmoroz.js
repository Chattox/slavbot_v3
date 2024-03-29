const { isAdmin } = require('../utils/isAdmin');
const { shuffleArray } = require('../utils/shuffleArray');
const { logSecretSantaPairs } = require('../utils/logSecretSantaPairs');
const regUsers = require('../regular_users.json');
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');

const dedmoroz = {
  name: 'dedmoroz',
  description:
    'runs a secret santa-like function using a secret santa role assigned to particiants, DMs all participants with their giftee',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true, message)) {
      const logInfo = [
        'utility',
        message.author,
        'dedmoroz',
        message.channel,
        args,
      ];
      if (args && /\d{2}\/\d{2}\/\d{4}/g.test(args[0])) {
        const dateArg = args[0].split('/').map(Number);
        const [saleDay, saleMonth, saleYear] = dateArg;
        const sendGiftStartDate = new Date(
          saleYear,
          saleMonth - 1,
          saleDay + 1
        );
        const sendGiftEndDate = new Date(saleYear, saleMonth - 1, saleDay + 2);
        const sendGiftStartTimestamp = Math.floor(
          sendGiftStartDate.getTime() / 1000
        ); // this is extremely dumb and I should not have to do this
        const sendGiftEndTimestamp = Math.floor(
          sendGiftEndDate.getTime() / 1000
        );

        // Loop through every user in the guild the message was sent to
        // Return a collection of all users with the secret santa role
        const usersWithSantaRole = message.guild.members.cache.filter(
          (user) => {
            return user.roles.cache.find(
              (role) => role.name === 'Secret Santa'
            );
          }
        );

        // Make an array of the user objects of the santas
        const santas = [];
        usersWithSantaRole.each((santa) => santas.push(santa.user));

        // Log some info
        const santaNames = santas.map((santa) => santa.username);
        logger.info(`Secret Santas: ${santaNames}`, {
          ...infoLogCtx(...logInfo),
          santas: santaNames,
        });

        // Shuffle santa array
        shuffleArray(santas);

        const pairings = []; // array to store santa pairings to write to file for reference in case something goes wrong

        // Go through each santa user obj and DM them with their giftee and the rules
        logger.info('DMing santas', infoLogCtx(...logInfo));
        santas.forEach((santa, i) => {
          const giftee = santas[(i + 1) % santas.length];
          const gifteeSteamName = regUsers[giftee.id]?.steamId;
          const gifteeSteamWishlistUrl = `https://store.steampowered.com/wishlist/profiles/${gifteeSteamName}/#sort=order`;
          pairings.push([santa.username, giftee.username]); // add pairing to pair array

          santa
            .send(
              `Welcome to Secret Slavbot ${new Date().getFullYear()}!\n\n` +
                `Your giftee this year is :sparkles: **${giftee.username}**! :sparkles:\n` +
                `${
                  gifteeSteamName
                    ? `Your giftee's Steam wishlist: ${gifteeSteamWishlistUrl}\n\n`
                    : `I couldn't find a wishlist for them, so make sure you have them added on Steam as you can access it from their profile!\n\n`
                }` +
                `The rules are:\n` +
                `1) Starting from <t:${sendGiftStartTimestamp}:t> <t:${sendGiftStartTimestamp}:D> (midnight GMT after the Steam sale starts), send your gift within 1 days's time.\n` +
                `2) Don't spend more than £15, give or take £2.\n` +
                `3) Make sure to update your own Steam wishlist to make it easier for your gifter!\n` +
                `4) Don't tell anyone who your giftee is!\n\n` +
                `So just to be clear, the time period in which to send your gift starts at <t:${sendGiftStartTimestamp}:t> <t:${sendGiftStartTimestamp}:D> and ends at <t:${sendGiftEndTimestamp}:t> <t:${sendGiftEndTimestamp}:D>\n\n` +
                `P.S. Make sure your wishlist is set to public!`
            )
            .then((res) => {
              logger.info(
                `${i + 1} out of ${santas.length} DMs sent`,
                infoLogCtx(...logInfo)
              );
              if (i + 1 >= santas.length) {
                logger.info('Santa DMing complete', infoLogCtx(...logInfo));
              }
            })
            .catch((err) =>
              logger.error(`Error DMing santa ${santa.username}`, {
                ...errLogCtx(...logInfo, err),
              })
            );
        });
        logSecretSantaPairs(pairings, sendGiftStartDate, message, args, logger);
      } else {
        logger.warn(
          'Dedmoroz command invoked without correct date argument',
          warnLogCtx(...logInfo)
        );
        message.author.send(
          'Dedmoroz requires a date argument formatted dd/mm/yyyy'
        );
      }
    }
  },
};

module.exports = dedmoroz;
