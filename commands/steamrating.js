const { isAdmin } = require('../utils/isAdmin');
const { formatSteamArgs } = require('../utils/formatSteamArgs');
const axios = require('axios').default;
const Fuse = require('fuse.js');
const { search } = require('ffmpeg-static');

const steamrating = {
  name: 'steamrating',
  description: 'returns steam rating for given game title',
  execute: async function (message, args) {
    if (isAdmin(message.author.id, true)) {
      const searchTerm = formatSteamArgs(args);

      if (searchTerm) {
        const searchOptions = {
          includeScore: true,
          keys: ['name'],
        };
        const appList = require('../steam_cache.json');
        const fuse = new Fuse(appList, searchOptions);

        console.log(`Starting appID search for ${searchTerm}...`);

        const searchResult = fuse.search(searchTerm, { limit: 1 })[0].item;

        console.log(
          `Found: ${searchResult.name} with appID: ${searchResult.appid}`
        );
        console.log(`Checking Steam rating for ${searchResult.name}...`);

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
          const percentPostive = Math.round(
            (summary.total_positive / summary.total_reviews) * 100
          );
          message.channel.send(
            `Game: **${searchResult.name}**\n` +
              `Reviews: **${summary.review_score_desc}** with ${percentPostive}% positive out of ${summary.total_reviews} reviews\n\n` +
              "NOTE: The number of total reviews will differ slightly than what Steam's store page says. This is because Steam is dumb and definitely nothing to do with anything I did."
          );
        });
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
