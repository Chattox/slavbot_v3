// It's slav time
const Discord = require('discord.js');
const fs = require('fs').promises;
const client = new Discord.Client();
const { prefix, TOKEN, ADMIN_ID } = require('./config.json');
const { playSound, randSound } = require('./slavsound');
const { createSoundManifest } = require('./slav_utils');
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

    // Log some info to console
    console.log('----------');
    const timeStamp = new Date();
    console.log(timeStamp.toLocaleDateString(), timeStamp.toLocaleTimeString());
    console.log(`User: ${message.author.username}`);
    console.log(`Admin: ${message.author.id === ADMIN_ID}`);
    console.log(`Command: ${command}`);

    // Admin commands
    if (command === 'create' && message.author.id === ADMIN_ID) {
      createSoundManifest();
    }
    if (command === 'read' && message.author.id === ADMIN_ID) {
      console.log(soundManifest);
    }

    // User commands

    // Random sounds
    // Random sound picked from all lists
    if (command === 'rand') {
      randSound([soundManifest.regularSounds, soundManifest.randSounds]);
    }

    // Specific sound command
    // Check if command is referencing a sound
    if (soundManifest.regularSounds.includes(command)) {
      console.log(`Sound ${command}`);
    }

    // fs.readdir('./sounds')
    //   .then(soundList => {
    //     // console.log(soundList);
    //     // Strip '.mp3' from list of files in sounds folder to make into args for playSound
    //     soundList.forEach((sound, index) => {
    //       soundList[index] = sound.slice(0, -4);
    //     });
    //     if (soundList.includes(command)) {
    //       playSound(command, message);
    //     }
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
    console.log('----------');
  }
});

client.login(TOKEN);

module.exports = { client };
