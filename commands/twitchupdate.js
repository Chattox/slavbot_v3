const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');

const twitchupdate = {
  name: 'twitchupdate',
  description: 'updates regusers with new twitchsound property',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      const regUsers = require('../regular_users.json');
      Object.keys(regUsers).forEach((userKey) => {
        regUsers[userKey].twitchSound = 'none';
      });
      const regUsersJson = JSON.stringify(regUsers);

      fs.writeFile('./regular_users.json', regUsersJson, 'utf8')
        .then((res) => {
          console.log('All regUsers updated with twitchSound property!');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};

module.exports = twitchupdate;
