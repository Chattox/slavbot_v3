const commandList = require('../command_list.json');
const fs = require('fs').promises;
const { isAdmin } = require('../utils/isAdmin');

const enable = {
  name: 'enable',
  description: 'enable a command to be used in slavbot',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      if (args) {
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
        console.log('No arguments given!');
      }
    }
  },
};

module.exports = enable;
