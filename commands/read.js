const { isAdmin } = require('../utils/isAdmin');

const read = {
  name: 'read',
  description: 'Console logs the soundManifest object',
  execute: function (message, args) {
    if (isAdmin(message)) {
      console.log(args);
    }
  },
};

module.exports = read;
