const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');

const playSound = async (sound, channel) => {
  const player = createAudioPlayer();
  const resource = createAudioResource(`./sounds/${sound}.mp3`);
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 15e3);
    connection.subscribe(player);
    console.log(`Playing "${sound}" in ${channel.name}...`);
    player.play(resource);
    player.on('idle', () => {
      console.log('Finished playing');
      connection.destroy();
    });
  } catch (error) {
    connection.destroy();
    throw error;
  }
};

module.exports = { playSound };
