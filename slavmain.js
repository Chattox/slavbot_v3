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
  // If message author is bot or no prefix, don't do thing
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

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
    console.log('----------');
  } else if (command === 'read' && message.author.id === ADMIN_ID) {
    console.log(soundManifest);
    console.log('----------');
  }

  // User commands

  // Random sounds
  // Random sound picked from all lists
  else if (command === 'rand') {
    randSound([soundManifest.regularSounds, soundManifest.randSounds], message);
  }

  // Specific sound command
  // Check if command is referencing a sound
  else if (soundManifest.regularSounds.includes(command)) {
    playSound(command, message);
  }

  // If command not recognised
  else {
    message.author.send(`"${command}" is not a recognised command, урод.`);
    console.log('Command not recognised');
    console.log('----------');
  }
  //delete message when done
  message.delete();
});

client.login(TOKEN);

module.exports = { client };
