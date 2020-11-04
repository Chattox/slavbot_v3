const isPlaying = (client) => {
  if (client.voice.connections.array().length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isPlaying };
