const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const {
  sndLogCtx,
  infoLogCtx,
  warnLogCtx,
} = require('./utils/loggingContextHelpers');

const playSound = async (sound, channel, logger, isRand = false) => {
  const player = createAudioPlayer();
  const resource = createAudioResource(`./sounds/${sound}.mp3`);
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 5e3);
    connection.subscribe(player);
    logger.info(
      `Playing "${sound}" in channel ${channel.name}`,
      sndLogCtx(sound, channel, isRand)
    );
    player.play(resource);
    player.on('idle', () => {
      logger.info('Finished playing', sndLogCtx(sound, channel, isRand));
      connection.destroy();
    });
  } catch (err) {
    connection.destroy();
    logger.error(
      'Error playing sound, this may be due to timing out from not having permission to join channel, or network issues',
      sndLogCtx(sound, channel, isRand),
      err
    );
  }
};

const randSound = (soundLists, message, logger) => {
  // Create new array that will contain all possible random sounds
  let randsounds = [];
  // Populate array with combination of regular and random only sound lists from sound_manifest.json
  randsounds = randsounds.concat(...soundLists);
  // Pick a random sound from the array and play
  randChoice = randsounds[Math.floor(Math.random() * randsounds.length)];
  playSound(randChoice, message, logger, true);
};

module.exports = { playSound, randSound };
