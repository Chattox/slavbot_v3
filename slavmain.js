// It's slav time
const Discord = require('discord.js');
const fs = require('fs').promises;
const client = new Discord.Client();
const { prefix, TOKEN, ADMIN_ID } = require('./config.json');
const { playSound, randSound } = require('./slavsound');
const soundManifest = require('./sound_manifest');
const commandList = [];

client.once('ready', () => {
  fs.readdir('./commands').then(files => {
    files.forEach(file => {
      commandList.push(file.slice(0, -3));
    });
    console.log(commandList);
  });
  console.log('READY!');
});

// When get message, do thing
client.on('message', async message => {
  // If message author is bot or no prefix, don't do thing
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  // Strip prefix separate command from args
  const args = message.content
    .substring(1)
    .toLowerCase()
    .split(' ');
  const command = args.shift();

  // Log some info to console
  console.log('----------');
  const timeStamp = new Date();
  console.log(timeStamp.toLocaleDateString(), timeStamp.toLocaleTimeString());
  console.log(`User: ${message.author.username}`);
  console.log(`Admin: ${message.author.id === ADMIN_ID}`);
  console.log(`Command: ${command}`);

  // Create possible list of sound commands based on if user is admin
  let soundCommands = soundManifest.regularSounds;
  if (message.author.id === ADMIN_ID) {
    soundManifest.randSounds.forEach(sound => {
      soundCommands.push(sound);
    });
  }

  if (commandList.includes(command)) {
    let func = require(`./commands/${command}.js`);
    if (args.length > 0) {
      func.execute(message, args);
    } else {
      func.execute(message, soundManifest);
    }
  }

  // Specific sound command
  // Check if command is referencing a sound using array we made earlier
  else if (soundCommands.includes(command)) {
    console.log(`playing sound ${command}`);
    playSound(command, message);
  }

  // If command not recognised
  else {
    message.author.send(`"${command}" is not a recognised command, урод.`);
    console.log('Command not recognised');
  }
  //delete message when done
  message.delete();
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.member.user.bot) {
    return;
  }
  const oldStateChannel = oldState.channel;
  const newStateChannel = newState.channel;

  if (oldStateChannel === null) {
    // Or if old channel was an afk channel
    console.log('----------');
    console.log(
      `${newState.member.user.username} has joined ${newStateChannel.name}`
    );
  } else if (newStateChannel === null) {
    console.log('----------');
    console.log(
      `${newState.member.user.username} has left ${oldStateChannel.name}`
    );
  }
});

client.login(TOKEN);

module.exports = { client };
