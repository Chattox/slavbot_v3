const { isAdmin } = require('../utils/isAdmin');
const fs = require('fs').promises;
const axios = require('axios').default;

// Download Steam's applist and save to file, overwriting if already exists.

const steamcache = {
  name: 'steamcache',
  description:
    'download steam applist and save to file, overwriting if already exists',
  execute: function (message) {
    if (isAdmin(message.author.id, true)) {
      const appListUrl =
        'https://api.steampowered.com/ISteamApps/GetAppList/v0001/';
      axios.get(appListUrl).then((res) => {
        console.log('Steam applist downloaded, saving to file...');
        const jsonSteamList = JSON.stringify(res.data.applist.apps.app);
        fs.writeFile(__dirname + '/../steam_cache.json', jsonSteamList, 'utf8')
          .then((res) => {
            console.log('steam_cache.json written!');
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  },
};

module.exports = steamcache;
