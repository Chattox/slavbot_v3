const { AudioPlayerStatus } = require('@discordjs/voice');

const isPlaying = (client) => {
  if (client.voice.adapters.size > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isPlaying };
