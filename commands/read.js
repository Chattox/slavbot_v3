const { ADMIN_ID } = require('../config.json');

module.exports = {
  name: 'read',
  description: 'Console logs the soundManifest object',
  execute: (message, args) => {
    if (message.author.id === 5) {
      console.log(args);
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
    }
  }
};
