const { ADMIN_ID } = require('../config.json');

const isAdmin = (message) => {
  if (message.author.id === ADMIN_ID) {
    return true;
  } else {
    console.log('----------');
    console.log('User is not admin');
    message.author.send('This command is for admins only, blyat');
    return false;
  }
};

module.exports = { isAdmin };
