const { isAdmin } = require('../utils/isAdmin');
const { formatSteamArgs } = require('../utils/formatSteamArgs');
const axios = require('axios').default;
const Fuse = require('fuse.js');

const steamrating = {
  name: 'steamrating',
  description: 'returns steam rating for given game title',
  execute: async function (message, args) {
    if (isAdmin(message.author.id, true)) {
      const searchTerm = formatSteamArgs(args);
      const searchOptions = {
        includeScore: true,
        keys: ['name'],
      };
      const appList = require('../steam_cache.json');
      const fuse = new Fuse(appList, searchOptions);

      if (searchTerm) {
        console.log(fuse.search(searchTerm, { limit: 1 }));
      } else {
        console.log('No arguments given!');
        message.channel.send(
          "I can't give you a rating if you don't give me a game!"
        );
      }
    }
  },
};

module.exports = steamrating;
