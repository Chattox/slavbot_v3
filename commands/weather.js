const { isAdmin } = require('../utils/isAdmin');
const { formatWeatherArgs } = require('../utils/formatWeatherArgs');
const axios = require('axios').default;
const { WEATHER_KEY } = require('../config.json');

const weather = {
  name: 'weather',
  description:
    'gives a weather forecast for the city name given as an argument',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
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
            message.channel.send(
              `The weather in ${name} is currently \"${description}\"! The temperature is ${temp}°C but feels like ${feels_like}°C.`
            );
          })
          .catch((err) => {
            console.log(
              `Weather command error ${err.response.status}: ${err.response.statusText}`
            );
            if (err.response.status === 404) {
              message.channel.send(
                `${args[0]} isn't even a real place, blyat!`
              );
            }
          });
      } else {
        console.log('No arguments given!');
        message.channel.send(
          "I can't give you the weather if you don't give me a location!"
        );
      }
    }
  },
};

module.exports = weather;
