// It's slav time
const Discord = require('discord.js');
const fs = require('fs').promises;
const client = new Discord.Client();
const { prefix, TOKEN } = require('./config.json');
const { playSound } = require('./slavsound');
const soundManifest = require('./sound_manifest');

client.once('ready', () => {
  console.log('READY!');
});

// When get message, do thing
client.on('message', async message => {
  // If message author is self, don't do thing
  if (message.author.id === client.user.id) {
    return;
  }

  // Check msg is valid command
  if (message.content.startsWith(prefix)) {
    // Strip prefix from message to get command
    const command = message.content.substring(1);

    // Check if command is referencing a sound
    fs.readdir('./sounds')
      .then(soundList => {
        // Strip '.mp3' from list of files in sounds folder to make into args for playSound
        soundList.forEach((sound, index) => {
          soundList[index] = sound.slice(0, -4);
        });
        if (soundList.includes(command)) {
          playSound(command, message);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
});

client.login(TOKEN);

module.exports = { client };
