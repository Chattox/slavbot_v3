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
    await entersState(connection, VoiceConnectionStatus.Ready, 5e3);
    connection.subscribe(player);
    console.log(`Playing "${sound}" in ${channel.name}...`);
    player.play(resource);
    player.on('idle', () => {
      console.log('Finished playing');
      connection.destroy();
    });
  } catch (error) {
    connection.destroy();
    console.log(
      `Timed out trying to connect to ${channel.name}, this could be due to not having permission to join or because of networking issues`
    );
  }
};

const randSound = (soundLists, message) => {
  // Create new array that will contain all possible random sounds
  let randSounds = [];
  // Populate array with combination of regular and random only sound lists from sound_manifest.json
  randSounds = randSounds.concat(...soundLists);
  // Pick a random sound from the array and play
  randChoice = randSounds[Math.floor(Math.random() * randSounds.length)];
  playSound(randChoice, message);
};

module.exports = { playSound, randSound };
