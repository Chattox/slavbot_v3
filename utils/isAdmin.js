const { ADMIN_IDS } = require('../config.json');

const isAdmin = (id, sendDm, message) => {
  if (ADMIN_IDS.includes(id)) {
    return true;
  } else {
    if (sendDm) {
      if (message) {
        message.author.send('This command is for admins only, blyat');
      }
    }
    return false;
  }
};

module.exports = { isAdmin };
