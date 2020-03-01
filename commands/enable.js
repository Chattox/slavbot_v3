const commandList = require('../command_list.json');
const fs = require('fs').promises;
const { ADMIN_ID } = require('../config.json');

const enable = {
  name: 'enable',
  description: 'enable a command to be used in slavbot',
  execute: function(message, args) {
    if (message.author.id === ADMIN_ID) {
      if (Object.keys(commandList).includes(args[0])) {
        commandList[args[0]] = true;
        const jsonCommandList = JSON.stringify(commandList);
        fs.writeFile('./command_list.json', jsonCommandList, 'utf8').then(
          () => {
            console.log(`Command "${args[0]}" has been enabled!`);
          }
        );
      } else {
        console.log('----------');
        console.log(`${args[0]} is not a recognised command`);
      }
    } else {
      console.log('----------');
      console.log('User is not admin');
      message.author.send('This command is for admins only, blyat');
    }
  }
};

module.exports = enable;
