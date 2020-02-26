const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;

module.exports = {
  name: 'reguser',
  description:
    'creates a regular user object from given discord ID and adds to regular_users.json',
  execute: (message, args) => {
    const user_id = args[0];
    message.guild.members
      .fetch(user_id)
      .then(obj => {
        const user = obj.user;
        if (!regUsers.hasOwnProperty(user.id)) {
          regUsers[user.id] = {
            name: user.username,
            joinSound: 'none',
            leaveSound: 'none'
          };
          const formattedRegUsers = JSON.stringify(regUsers);
          fs.writeFile('./regular_users.json', formattedRegUsers, 'utf8')
            .then(res => {
              console.log(`${user.username} added to regular users!`);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log('----------');
          console.log(`User ${user.username} already exists`);
          console.log('----------');
        }
      })
      .catch(err => {
        console.log('----------');
        console.log(`Error: ${err.message}`);
        console.log('----------');
      });
  }
};
