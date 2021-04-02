// Format arguments passed to the weather command into a single string accepted by OpenWeatherMap API.
// Format is <city name>,<country code>

const weather = require('../commands/weather');

const formatWeatherArgs = (weatherArgs) => {
  if (!weatherArgs) {
    return false;
  }
  const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~0-9]/g;
  const words = [];
  weatherArgs.forEach((word) => {
    words.push(word.replace(regex, ''));
  });
  const result = words.join(',');
  return result;
};

module.exports = { formatWeatherArgs };
