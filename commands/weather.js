const { isAdmin } = require('../utils/isAdmin');
const axios = require('axios').default;
const { WEATHER_KEY } = require('../config.json');

const weather = {
  name: 'weather',
  description:
    'gives a weather forecast for the city name given as an argument',
  execute: function (message, args) {
    if (isAdmin(message.author.id, true)) {
      const options = {
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather',
        params: {
          q: 'fkhskfn',
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
          console.log(
            `The weather in ${name} is currently \"${description}\"! The temperature is ${temp}°C but feels like ${feels_like}°C.`
          );
        })
        .catch((err) => {
          console.log(
            `Weather command error ${err.response.status}: ${err.response.statusText}`
          );
          if (err.response.status === 404) {
            message.channel.send(`${args[0]} isn't even a real place, blyat!`);
          }
        });
    }
  },
};

module.exports = weather;