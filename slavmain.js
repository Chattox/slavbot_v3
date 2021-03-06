// It's slav time
const { Client } = require('discord.js');
const fs = require('fs').promises;
const client = new Client();
const {
  SND_PREFIX,
  CMD_PREFIX,
  TOKEN,
  LOAN_ID,
  LOAN_TWITCH,
} = require('./config.json');
const { isAdmin } = require('./utils/isAdmin');
const { playSound, randSound } = require('./slavsound');
const soundManifest = require('./sound_manifest');
const { isEqual } = require('./utils/isEqual');
const { isPlaying } = require('./utils/isPlaying');

client.once('ready', () => {
  // Read all filenames of the commands dir to check for new commands
  fs.readFile('./command_list.json').then((data) => {
    console.log('Checking for new commands...');
    const commandListFile = JSON.parse(data);
    const cmdListFileOrig = {};
    Object.assign(cmdListFileOrig, commandListFile);
    fs.readdir('./commands')
      .then((files) => {
        // Check each file name to see if it has an entry in the cmd ref obj, if not then add it w/ default val of true (enabled)
        files.forEach((file) => {
          commandName = file.slice(0, -3);
          if (!Object.keys(commandListFile).includes(commandName)) {
            console.log(`New command: ${commandName}!`);
            commandListFile[commandName] = true;
          }
        });
        // Go through each property on the ref obj and check against the array of file names. If a command has been removed from the cmd folder, remove it from the ref obj
        const fileList = files.map((file) => {
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
            .then((res) => {
              console.log('command_list.json written!');
            })
            .catch((err) => {
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
client.on('message', async (message) => {
  // If message author is bot or no prefix, don't do thing
  if (
    (!message.content.startsWith(SND_PREFIX) &&
      !message.content.startsWith(CMD_PREFIX)) ||
    message.author.bot
  ) {
    return;
  }

  // Decide if sound or other command
  const isCommand = message.content.startsWith(CMD_PREFIX);

  // Strip prefix separate command from args
  const args = message.content.substring(1).toLowerCase().split(' ');
  const command = args.shift();

  // Log some info to console
  console.log('----------');
  const timeStamp = new Date();
  console.log(timeStamp.toLocaleDateString(), timeStamp.toLocaleTimeString());
  console.log(`User: ${message.author.username}`);
  console.log(`Admin: ${isAdmin(message.author.id, false)}`);
  console.log(`Command: ${command}`);
  console.log(`Args: ${args}`);

  // Check if slavbot is currently playing a sound, if so refuse command
  if (
    !isPlaying(client) ||
    command === 'stop' ||
    isAdmin(message.author.id, false)
  ) {
    // Create possible list of sound commands based on if user is admin
    let soundCommands = [...soundManifest.regularSounds];
    if (isAdmin(message.author.id, false)) {
      soundManifest.randSounds.forEach((sound) => {
        soundCommands.push(sound);
      });
      soundManifest.randcoin.forEach((sound) => {
        soundCommands.push(sound);
      });
    }

    // Check command against commandlist, if exists check if enabled, if enabled do the thing
    const commandList = require('./command_list.json');
    if (
      isCommand ||
      (command.includes('rand') && Object.keys(commandList).includes(command))
    ) {
      if (commandList[command] === true || isAdmin(message.author.id, false)) {
        let func = require(`./commands/${command}.js`);
        if (args.length > 0) {
          func.execute(message, args);
        } else {
          func.execute(message);
        }
      } else {
        console.log('----------');
        console.log('Command disabled or not found');
        console.log(`Notifying ${message.author.username}`);
        message.author.send("This command is disabled or doesn't exist!");
      }
    }

    // Specific sound command
    // Check if command is referencing a sound using array we made earlier
    else if (soundCommands.includes(command)) {
      if (message.member.voice.channel) {
        playSound(command, message.member.voice.channel).catch((err) =>
          console.log(err)
        );
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
  } else {
    console.log('Sound already playing! Rejecting command.');
    message.author.send('Wait your damn turn, урод');
    message.delete();
  }
});

// Voice state update (joining/leaving channels)
client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.member.user.bot) {
    return;
  }

  // Check if slavbot is already playing something to stop from interrupting
  if (!isPlaying(client)) {
    const oldStateChannel = oldState.channel;
    const newStateChannel = newState.channel;

    if (
      (oldStateChannel === null ||
        oldState.channelID === oldState.guild.afkChannelID) &&
      newState.channelID !== newState.guild.afkChannelID &&
      newStateChannel !== null
    ) {
      // For user joining voice, or coming from AFK channel
      console.log('----------');
      const timeStamp = new Date();
      console.log(
        timeStamp.toLocaleDateString(),
        timeStamp.toLocaleTimeString()
      );
      if (newStateChannel === null) {
        console.log(
          `${newState.member.user.username} has joined a channel but could not get channel information`
        );
      } else {
        console.log(
          `${newState.member.user.username} has joined ${
            newStateChannel.name || 'no name'
          }`
        );
      }
      const regUsers = require('./regular_users.json');
      if (newState.member.id in regUsers) {
        const regJoinSound = regUsers[newState.id].joinSound;
        if (regJoinSound.startsWith('rand')) {
          // This bit is to allow random join sounds from a specific rand list
          randSound([soundManifest[regJoinSound]], newState.channel);
        } else if (regJoinSound !== 'none') {
          playSound(regJoinSound, newState.channel);
        }
      }
    } else if (newStateChannel === null) {
      // For user leaving voice
      console.log('----------');
      const timeStamp = new Date();
      console.log(
        timeStamp.toLocaleDateString(),
        timeStamp.toLocaleTimeString()
      );
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
  } else {
    console.log('----------');
    console.log(
      `${newState.member.user.username} ${
        oldState.channel === null ? 'joined' : 'left'
      } but slavbot was already playing something`
    );
  }
});

// Play sound when Loan goes live and play in the first voice channel of the server
client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (newPresence.user.id === LOAN_ID) {
    // Make sure the update is an actual change, is from Loan, and is Twitch, and that it's the first update containing twitch
    let oldPresenceNotTwitch = true;
    if (typeof oldPresence !== 'undefined') {
      oldPresence.activities.forEach((activity) => {
        if (activity.name === 'Twitch') {
          oldPresenceNotTwitch = false;
        }
      });
      if (oldPresenceNotTwitch) {
        newPresence.activities.forEach((activity) => {
          if (!newPresence.equals(oldPresence) && activity.name === 'Twitch') {
            const firstChannel = newPresence.guild.channels.cache
              .filter((channel) => channel.type === 'voice')
              .first();

            console.log(`----------`);
            console.log(
              `${newPresence.user.username} has gone live on ${activity.name}`
            );

            playSound(LOAN_TWITCH, firstChannel);
          }
        });
      }
    } else {
      console.log('----------');
      console.log('oldPresence was undefined');
      console.log('----------');
    }
  }
});

client.login(TOKEN);

module.exports = { client };

/*
  TO-DO:
  - Add ability to add sounds to specific randlists via chat command
  - Fix !create overwriting edited random lists with lists loaded at startup
*/
