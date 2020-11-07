const { isAdmin } = require('../utils/isAdmin');
const { shuffleArray } = require('../utils/shuffleArray');

const dedmoroz = {
  name: 'dedmoroz',
  description:
    'runs a secret santa-like function using a secret santa role assigned to particiants, DMs all participants with their giftee',
  execute: function (message) {
    if (isAdmin(message.author.id, true)) {
      // Loop through every user in the guild the message was sent to
      // Return a collection of all users with the secret santa role
      const usersWithSantaRole = message.guild.members.cache.filter((user) => {
        return user.roles.cache.find((role) => role.name === 'Secret Santa');
      });

      // Make an array of the user objects of the santas
      const santas = [];
      usersWithSantaRole.each((santa) => santas.push(santa.user));

      // Log some info
      console.log('----- Secret Santas -----');
      santas.forEach((santa) => console.log(santa.username));
      console.log('----------');
      console.log('Shuffling...');

      // Shuffle santa array
      shuffleArray(santas);

      // Go through each santa user obj and DM them with their giftee and the rules
      console.log('DMing santas...');
      santas.forEach((santa, i) => {
        santa
          .send(
            `Welcome to Secret Slavbot ${new Date().getFullYear()}!\n` +
              `Your giftee this year is **${
                santas[(i + 1) % santas.length].username
              }**!\n` +
              `The rules are:\n` +
              `1) Send your gift on the *second* day of the Steam Winter Sale. This allows people to look through the store for the perfect gift!\n` +
              `2) Don't spend more than £15, give or take £2.\n` +
              `3) Make sure to update your own Steam wishlist to make it easier for your gifter!\n` +
              `4) Don't tell anyone who your giftee is!`
          )
          .then((res) => {
            console.log(`${i + 1} out of ${santas.length} DMs sent!`);
            if (i + 1 >= santas.length) {
              console.log('Done!');
            }
          })
          .catch((err) => console.log(err));
      });
    }
  },
};

module.exports = dedmoroz;
