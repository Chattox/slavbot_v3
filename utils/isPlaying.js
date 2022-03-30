const isPlaying = (client) => {
  if (client.voice.adapters.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isPlaying };
