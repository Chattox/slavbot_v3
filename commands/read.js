module.exports = {
  name: 'read',
  description: 'Console logs the soundManifest object',
  execute: (message, args) => {
    if (message.author.id === ADMIN_ID) {
      console.log(args);
    } else {
      message.author.send('This command is for admins only, blyat');
    }
  }
};
