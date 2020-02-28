const { ADMIN_ID } = require('../config.json');

const read = {
  name: 'read',
  description: 'Console logs the soundManifest object',
  isEnabled: true,
  execute: function(message, args) {
    console.log(this.isEnabled);
    if (this.isEnabled) {
      if (message.author.id === ADMIN_ID) {
        console.log(args);
      } else {
        console.log('----------');
        console.log('User is not admin');
        message.author.send('This command is for admins only, blyat');
      }
    } else {
      console.log('----------');
      console.log('Command is disabled');
      message.author.send('This command is disabled!');
    }
  }
};

module.exports = read;
