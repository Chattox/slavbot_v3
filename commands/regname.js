const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');
const regname = {
  name: 'regname',
  description: 'updates the name property of existing regular user object',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      if (args) {
        if (regUsers[args[0]]) {
          const oldName = regUsers[args[0]].name;
          regUsers[args[0]].name = args[1];
          const formattedRegUsers = JSON.stringify(regUsers);
          fs.writeFile('./regular_users.json', formattedRegUsers, 'utf8')
            .then((res) => {
              console.log(
                `User "${oldName}" updated to "${regUsers[args[0]].name}"!`
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log('----------');
          console.log(`User at ID ${args[0]} is not a regular user`);
        }
      } else {
        console.log('----------');
        console.log('No arguments given!');
      }
    }
  },
};

module.exports = regname;
