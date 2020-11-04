const { isAdmin } = require('../utils/isAdmin');

const readuser = {
  name: 'readuser',
  description:
    'Console logs the activities of the user object of the given ID. If no ID given, logs the author',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      // check if args is an ID
      if (typeof args[0] === 'string') {
        console.log(
          message.guild.members.cache.get(args.toString()).presence.activities
        );
      } else {
        console.log(message.author.presence.activities);
      }
    }
  },
};

module.exports = readuser;
