// It's slav time
const Discord = require('discord.js');
const fs = require('fs').promises;
const client = new Discord.Client();
const { prefix, TOKEN, ADMIN_ID, SMORD_ID } = require('./config.json');
const { playSound, randSound } = require('./slavsound');
const soundManifest = require('./sound_manifest');
const { isEqual } = require('./slav_utils');

client.once('ready', () => {
  // Read all filenames of the commands dir to check for new commands
  fs.readFile('./command_list.json').then(data => {
    console.log('Checking for new commands...');
    const commandListFile = JSON.parse(data);
    const cmdListFileOrig = {};
    Object.assign(cmdListFileOrig, commandListFile);
    fs.readdir('./commands')
      .then(files => {
        // Check each file name to see if it has an entry in the cmd ref obj, if not then add it w/ default val of true (enabled)
        files.forEach(file => {
          commandName = file.slice(0, -3);
          if (!Object.keys(commandListFile).includes(commandName)) {
            console.log(`New command: ${commandName}!`);
            commandListFile[commandName] = true;
          }
        });
        // Go through each property on the ref obj and check against the array of file names. If a command has been removed from the cmd folder, remove it from the ref obj
        const fileList = files.map(file => {
          return file.slice(0, -3);
        });
        for (cmd in commandListFile) {
          if (!fileList.includes(cmd)) {
            delete commandListFile[cmd];
          }
        }
        // If the commands ref obj has changed, overwrite the existing ref obj in the file
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
  console.log(`Args: ${args}`);

  // Create possible list of sound commands based on if user is admin
  let soundCommands = [...soundManifest.regularSounds];
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
    if (message.member.voice.channel) {
      playSound(command, message.member.voice.channel);
    } else {
      console.log('User was not in a voice channel');
    }
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

  if (
    (oldStateChannel === null ||
      oldState.channelID === oldState.guild.afkChannelID) &&
    newState.channelID !== newState.guild.afkChannelID
  ) {
    // For user joining voice, or coming from AFK channel
    console.log('----------');
    const timeStamp = new Date();
    console.log(timeStamp.toLocaleDateString(), timeStamp.toLocaleTimeString());
    console.log(
      `${newState.member.user.username} has joined ${newStateChannel.name}`
    );
    const regUsers = require('./regular_users.json');
    if (newState.member.id in regUsers) {
      if (regUsers[newState.id].joinSound !== 'none') {
        playSound(regUsers[newState.id].joinSound, newState.channel);
      } else if (newState.id === SMORD_ID) {
        randSound([soundManifest.coinSounds], newState.channel);
      }
    }
  } else if (newStateChannel === null) {
    // For user leaving voice
    console.log('----------');
    const timeStamp = new Date();
    console.log(timeStamp.toLocaleDateString(), timeStamp.toLocaleTimeString());
    console.log(
      `${newState.member.user.username} has left ${oldStateChannel.name}`
    );
    const regUsers = require('./regular_users.json');
    if (oldState.member.id in regUsers) {
      if (regUsers[oldState.id].leaveSound !== 'none') {
        playSound(regUsers[newState.id].leaveSound, oldState.channel);
      }
    }
  }
});

client.login(TOKEN);

module.exports = { client };
