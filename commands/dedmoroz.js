const { isAdmin } = require('../utils/isAdmin');

const dedmoroz = {
  name: 'dedmoroz',
  description:
    'runs a secret santa-like function using reactions to a given message, and DMs all participants with their giftee',
  execute: function (message, args) {
    if (isAdmin(message)) {
      // Participants (giftees) are passed via their user IDs as arguments
      const giftees = [];
      // Go through each ID argument and get the user obj associated with it. Add that to giftees array
      args.forEach((userID) => {
        const user = message.guild.members.cache.get(userID).user;
        giftees.push(user);
      });
      console.log('Giftees ---------V');
      giftees.forEach((giftee) => {
        console.log(giftee.username);
      });
      // Shuffle giftees array.
      shuffleArray(giftees);
      // Go through each giftee user obj and DM them with their giftee and the rules
      giftees.forEach((giftee, i) => {
        giftee
          .send(
            `Welcome to Secret Slavbot ${new Date().getFullYear()}!\n` +
              `Your giftee this year is **${
                giftees[(i + 1) % giftees.length].username
              }**!\n` +
              `The rules are:\n` +
              `1) Send your gift on the *second* day of the Steam Winter Sale. This allows people to look through the store for the perfect gift!\n` +
              `2) Don't spend more than £15, give or take £2.\n` +
              `3) Make sure to update your own Steam wishlist to make it easier for your gifter!\n` +
              `4) Don't tell anyone who your giftee is!`
          )
          .catch((err) => {
            console.log(err);
          });
      });
    }
  },
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

module.exports = dedmoroz;
