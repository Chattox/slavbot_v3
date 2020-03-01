const { ADMIN_ID } = require('../config.json');

const read = {
  name: 'read',
  description: 'Console logs the soundManifest object',
  execute: function(message, args) {
    console.log(this.isEnabled);
    if (message.author.id === ADMIN_ID) {
      console.log(args);
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
    }
  }
};

module.exports = read;
