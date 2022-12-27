const { isAdmin } = require('../utils/isAdmin');
const fs = require('fs').promises;
const axios = require('axios').default;
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');

// Download Steam's applist and save to file, overwriting if already exists.

const steamcache = {
  name: 'steamcache',
  description:
    'download steam applist and save to file, overwriting if already exists',
  execute: function (message, args, logger) {
    if (isAdmin(message.author.id, true)) {
      const logInfo = [
        'utility',
        message.author,
        'steamcache',
        message.channel,
        args,
      ];
      const appListUrl =
        'https://api.steampowered.com/ISteamApps/GetAppList/v0001/';
      axios.get(appListUrl).then((res) => {
        logger.info(
          'Steam applist downloaded, saving to file',
          infoLogCtx(...logInfo)
        );
        const jsonSteamList = JSON.stringify(res.data.applist.apps.app);
        fs.writeFile(__dirname + '/../steam_cache.json', jsonSteamList, 'utf8')
          .then((res) => {
            logger.info('steam_cache.json written', infoLogCtx(...logInfo));
          })
          .catch((err) => {
            logger.error(
              'Error writing to steam_cache.json',
              errLogCtx(...logInfo, err)
            );
          });
      });
    }
  },
};

module.exports = steamcache;
