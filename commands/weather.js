const { formatWeatherArgs } = require('../utils/formatWeatherArgs');
const axios = require('axios').default;
const { WEATHER_KEY } = require('../config.json');
const {
  infoLogCtx,
  warnLogCtx,
  errLogCtx,
} = require('../utils/loggingContextHelpers');

const weather = {
  name: 'weather',
  description:
    'gives a weather forecast for the city name given as an argument',
  execute: function (message, args, logger) {
    const logInfo = [
      'utility',
      message.author,
      'weather',
      message.channel,
      args,
    ];
    const searchTerm = formatWeatherArgs(args);
    if (searchTerm) {
      const options = {
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather',
        params: {
          q: formatWeatherArgs(args),
          appid: WEATHER_KEY,
          units: 'metric',
        },
      };

      axios
        .request(options)
        .then((res) => {
          const { name } = res.data;
          const { description } = res.data.weather[0];
          const { temp, feels_like } = res.data.main;
          logger.info(
            `Found weather for ${name} (${description}) and posting to channel ${message.channel.name}`,
            infoLogCtx(...logInfo)
          );
          message.channel.send(
            `The weather in ${name} is currently \"${description}\"! The temperature is ${temp}°C but feels like ${feels_like}°C.`
          );
        })
        .catch((err) => {
          logger.error('Weather command error', errLogCtx(...logInfo, err));
          if (err.response.status === 404) {
            message.channel.send(`${args[0]} isn't even a real place, blyat!`);
          }
        });
    } else {
      logger.warn('No arguments given', warnLogCtx(...logInfo));
      message.channel.send(
        "I can't give you the weather if you don't give me a location!"
      );
    }
  },
};

module.exports = weather;
