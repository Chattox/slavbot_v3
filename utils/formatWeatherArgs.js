// Format arguments passed to the weather command into a single string accepted by OpenWeatherMap API.
// Format is <city name>,<country code>

const formatWeatherArgs = (weatherArgs) => {
  // console.log(weatherArgs);
  // const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  // weatherArgs.forEach((word) => {
  //   word.replace(regex, '');
  // });
  const result = weatherArgs.join(',');
  // console.log(result);
  return result;
};

module.exports = { formatWeatherArgs };
