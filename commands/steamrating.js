const { formatSteamArgs } = require('../utils/formatSteamArgs');
const axios = require('axios').default;
const Fuse = require('fuse.js');
const { search } = require('ffmpeg-static');
const { infoLogCtx, warnLogCtx } = require('../utils/loggingContextHelpers');

const steamrating = {
  name: 'steamrating',
  description: 'returns steam rating for given game title',
  execute: async function (message, args, logger) {
    const searchTerm = formatSteamArgs(args);

    const logInfo = [
      'utility',
      message.author,
      'steamrating',
      message.channel,
      args,
    ];

    if (searchTerm) {
      const searchOptions = {
        includeScore: true,
        keys: ['name'],
      };
      const appList = require('../steam_cache.json');
      const fuse = new Fuse(appList, searchOptions);

      logger.info(
        `Starting appID search for ${searchTerm}`,
        infoLogCtx(...logInfo)
      );

      const searchResult = fuse.search(searchTerm, { limit: 1 })[0].item;

      logger.info(
        `Found: ${searchResult.name} with appID: ${searchResult.appid}`,
        infoLogCtx(...logInfo)
      );
      logger.info(
        `Checking Steam rating for ${searchResult.name}`,
        infoLogCtx(...logInfo)
      );

      const axiosOptions = {
        method: 'GET',
        url: `https://store.steampowered.com/appreviews/${searchResult.appid}`,
        params: {
          json: 1,
          filter: 'recent',
          language: 'all',
        },
      };

      axios.request(axiosOptions).then((res) => {
        const summary = res.data.query_summary;
        const percentPostive = Math.floor(
          (summary.total_positive / summary.total_reviews) * 100
        );
        message.channel.send(
          `Game: **${searchResult.name}**\n` +
            `Reviews: **${summary.review_score_desc}** with ${percentPostive}% positive out of ${summary.total_reviews} reviews\n\n` +
            "NOTE: The number of total reviews will differ slightly than what Steam's store page says. This is because Steam is dumb and definitely nothing to do with anything I did."
        );

        logger.info(
          `Steam rating found (${percentPostive}% positive) and posted to chat`,
          infoLogCtx(...logInfo)
        );
      });
    } else {
      logger.warn('No arguments given', warnLogCtx(...logInfo));
      message.channel.send(
        "I can't give you a rating if you don't give me a game!"
      );
    }
  },
};

module.exports = steamrating;
