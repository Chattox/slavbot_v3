// It's slav time
const Discord = require('discord.js');
const fs = require('fs').promises;
const client = new Discord.Client();
const { prefix, TOKEN, ADMIN_ID } = require('./config.json');
const { playSound, randSound } = require('./slavsound');
const soundManifest = require('./sound_manifest');
const { isEqual } = require('./slav_utils');

client.once('ready', () => {
  fs.readFile('./command_list.json').then(data => {
    console.log('Checking for new commands...');
    const commandListFile = JSON.parse(data);
    const cmdListFileOrig = {};
    Object.assign(cmdListFileOrig, commandListFile);
    fs.readdir('./commands')
      .then(files => {
        files.forEach(file => {
          commandName = file.slice(0, -3);
          if (!Object.keys(commandListFile).includes(commandName)) {
            console.log(`New command: ${commandName}!`);
            commandListFile[commandName] = true;
          }
        });
        if (isEqual(commandListFile, cmdListFileOrig) === false) {
          const jsonCommandListFile = JSON.stringify(commandListFile);
          fs.writeFile('./command_list.json', jsonCommandListFile, 'utf8')
            .then(res => {
              console.log('command_list.json written!');
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log('No new commands found!');
        }
      })
      .then(() => {
        console.log('READY!');
      });
  });
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

  // Check command against commandlist, if exists check if enabled, if enabled do the thing
  const commandList = require('./command_list.json');
  if (Object.keys(commandList).includes(command)) {
    if (commandList[command] === true || message.author.id === ADMIN_ID) {
      let func = require(`./commands/${command}.js`);
      if (args.length > 0) {
        func.execute(message, args);
      } else {
        func.execute(message, soundManifest);
      }
    } else {
      console.log('----------');
      console.log('Command is disabled');
      console.log(`Notifying ${message.author.username}`);
      message.author.send('This command is disabled!');
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

// Voice state update (joining/leaving channels)
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

/*
Seperate isEnabled property from commands into reference JSON object.
example:
{
  read: true,
  create: false,
  rand: true
  etc..
} 

When checking if chat command is present in commandsList (line 50), also check command against ref obj to see if enabled or not. If command: true, .execute(), if command: false, send console logs and dm explaining.

When bot starts up and populates commandsList (line 11), also check if each command has an entry in ref obj. If not, create one with default val of true.
*/
