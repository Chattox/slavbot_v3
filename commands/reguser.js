const soundManifest = require('../sound_manifest');
const regUsers = require('../regular_users');
const fs = require('fs').promises;
const { ADMIN_ID } = require('../config.json');

const reguser = {
  name: 'reguser',
  description:
    'creates a regular user object from given discord ID and adds to regular_users.json',
  execute: function(message, args) {
    if (message.author.id === ADMIN_ID) {
      const user_id = args[0];
      // fetcher user object through guild to make sure user is on server command is given
      message.guild.members
        .fetch(user_id)
        .then(obj => {
          const user = obj.user;
          // If user doesn't already exist, create regUser obj and write to file
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
          }
        })
        .catch(err => {
          console.log('----------');
          console.log(`Error: ${err.message}`);
          console.log('----------');
        });
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
      message.delete();
    }
  }
};

module.exports = reguser;
