const { ADMIN_IDS } = require('../config.json');

const isAdmin = (id, sendDm) => {
  if (ADMIN_IDS.includes(id)) {
    return true;
  } else {
    if (sendDm) {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
    }
    return false;
  }
};

module.exports = { isAdmin };
