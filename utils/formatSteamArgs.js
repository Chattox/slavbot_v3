// Format arguments passed to the steamrating command into a single string accepted by fuse.

const formatSteamArgs = (steamArgs) => {
  if (!steamArgs) {
    return false;
  }
  const regex = /[!"#£$%&'()*+,-./:;<=>?@[\]^_`{|}~0-9]/g;
  const words = [];
  steamArgs.forEach((word) => {
    words.push(word.replace(regex, ''));
  });
  const result = words.join(' ');
  return result;
};

module.exports = { formatSteamArgs };
