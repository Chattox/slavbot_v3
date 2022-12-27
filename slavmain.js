// It's slav time
const { SND_PREFIX, CMD_PREFIX, TOKEN, INTENTS } = require('./config.json');
const { Client } = require('discord.js');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs').promises;
const client = new Client({ intents: INTENTS });
const { isAdmin } = require('./utils/isAdmin');
const { playSound, randSound } = require('./slavsound');
const soundManifest = require('./sound_manifest');
const regUsers = require('./regular_users.json');
const { isEqual } = require('./utils/isEqual');
const { isPlaying } = require('./utils/isPlaying');
const { createLogger } = require('winston');
const { format } = require('path');
const {
  sysLogCtx,
  cmdLogCtx,
  infoLogCtx,
  warnLogCtx,
} = require('./utils/loggingContextHelpers');

// Logging
const rotateFileTransport = new DailyRotateFile({
  level: 'info',
  filename: 'slavlog-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: './logs',
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  level: 'silly',
});

const logger = createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [rotateFileTransport, consoleTransport],
});

client.once('ready', () => {
  // Read all filenames of the commands dir to check for new commands
  fs.readFile('./command_list.json').then((data) => {
    logger.info('Checking for new commands...', sysLogCtx('startup'));
    const commandListFile = JSON.parse(data);
    const cmdListFileOrig = {};
    Object.assign(cmdListFileOrig, commandListFile);
    fs.readdir('./commands')
      .then((files) => {
        // Check each file name to see if it has an entry in the cmd ref obj, if not then add it w/ default val of true (enabled)
        files.forEach((file) => {
          commandName = file.slice(0, -3);
          if (!Object.keys(commandListFile).includes(commandName)) {
            logger.info(`New command: ${commandName}!`, sysLogCtx('startup'));
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
              logger.info('command_list.json written!', sysLogCtx('startup'));
            })
            .catch((err) => {
              logger.error(
                'Error writing command_list.json',
                sysLogCtx('startup'),
                err
              );
            });
        } else {
          logger.info('No new commands found!', sysLogCtx('startup'));
        }
      })
      .then(() => {
        logger.info('READY!', sysLogCtx('startup'));
      });
  });
});

// When get message, do thing
client.on('messageCreate', async (message) => {
  // If message author is bot or msg has no prefix, don't do thing
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

  // If message is in voice text channel, delete message, don't do command, DM message author that they're not supported currently
  if (message.channel.type === 'GUILD_VOICE') {
    logger.warn(
      `${message.author.username} attempted to use command "${command}" in voice text channel ${message.channel.name}. Ignoring command and DMing author`,
      warnLogCtx('command', message.author, command, message.channel)
    );
    message.delete();
    message.author.send(
      "Using commands in voice text channels isn't currently supported, blyat"
    );
    return;
  }

  // Log some info
  logger.info(
    `${message.author.username} invoked command ${command}`,
    cmdLogCtx(
      message.content[0],
      message.author,
      command,
      message.channel,
      args
    )
  );

  // Check if slavbot is currently playing a sound, if so refuse command
  if (
    !isPlaying(client) ||
    command === 'stop' ||
    isAdmin(message.author.id, false)
  ) {
    // Create possible list of sound commands based on if user is admin
    let soundCommands = [...soundManifest.regularSounds];
    if (isAdmin(message.author.id, false)) {
      soundManifest.randsounds.forEach((sound) => {
        soundCommands.push(sound);
      });
      soundManifest.randcoin.forEach((sound) => {
        soundCommands.push(sound);
      });
    }

    // Check command against commandlist, if exists check if enabled, if enabled do the thing
    const commandList = require('./command_list.json');
    if (isCommand || command.includes('rand')) {
      if (
        Object.keys(commandList).includes(command) &&
        (commandList[command] === true || isAdmin(message.author.id, false))
      ) {
        let func = require(`./commands/${command}.js`);
        if (args.length > 0) {
          func.execute(message, args, logger);
        } else {
          func.execute(message, logger);
        }
      } else if (
        Object.keys(commandList).includes(command) &&
        !commandList[command]
      ) {
        logger.warn(
          `${message.author.username} invoked disabled command ${command}`,
          warnLogCtx('command', message.author, command, message.channel)
        );
        message.author.send(`"${command}" is disabled!`);
      } else {
        logger.warn(
          `${message.author.username} invoked command "${command}" but command was not found`,
          warnLogCtx('command', message.author, command, message.channel)
        );
        message.author.send(`"${command}" is not a valid command!`);
      }
    }

    // Specific sound command
    // Check if command is referencing a sound using array we made earlier
    else if (soundCommands.includes(command)) {
      if (message.member.voice.channel) {
        playSound(command, message.member.voice.channel, logger).catch((err) =>
          logger.error(
            'Error playing sound from command',
            cmdLogCtx(
              message.content[0],
              message.author,
              command,
              message.channel,
              args
            ),
            err
          )
        );
      } else {
        logger.warn(
          `${message.author.username} invoked sound command "${command}" while not in a voice channel`,
          warnLogCtx('command', message.author, command, message.channel)
        );
      }
    }

    // If command not recognised
    else {
      message.author.send(`"${command}" is not a recognised command, урод.`);
      logger.warn(
        `${message.author.username} invoked command "${command}" but command was not found`,
        warnLogCtx('command', message.author, command, message.channel)
      );
    }
    //delete message when done
    message.delete();
  } else {
    logger.warn(
      'Sound already playing, rejecting command',
      warnLogCtx('command', message.author, command, message.channel)
    );
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
        oldState.channelId === oldState.guild.afkChannelId) &&
      newState.channelId !== newState.guild.afkChannelId &&
      newStateChannel !== null
    ) {
      // For user joining voice, or coming from AFK channel
      if (newStateChannel === null) {
        logger.warn(
          `${newState.member.user.username} has joined a channel but could not get channel information`,
          warnLogCtx(
            'voiceStateUpdate',
            newState.member.user,
            undefined,
            newStateChannel
          )
        );
      } else {
        logger.info(
          `${newState.member.user.username} has joined channel ${
            newStateChannel.name || 'no name'
          }`,
          infoLogCtx(
            'voiceStateUpdate',
            newState.member.user,
            undefined,
            newStateChannel
          )
        );
      }
      const regUsers = require('./regular_users.json');
      if (newState.member.id in regUsers) {
        const regJoinSound = regUsers[newState.id].joinSound;
        if (regJoinSound.startsWith('rand')) {
          // This bit is to allow random join sounds from a specific rand list
          randSound([soundManifest[regJoinSound]], newState.channel, logger);
        } else if (regJoinSound !== 'none') {
          playSound(regJoinSound, newState.channel, logger);
        }
      }
    } else if (newStateChannel === null) {
      // For user leaving voice
      logger.info(
        `${newState.member.user.username} has left channel ${oldStateChannel.name}`,
        infoLogCtx(
          'voiceStateUpdate',
          newState.member.user,
          undefined,
          oldStateChannel
        )
      );
      const regUsers = require('./regular_users.json');
      if (oldState.member.id in regUsers) {
        if (regUsers[oldState.id].leaveSound !== 'none') {
          playSound(regUsers[newState.id].leaveSound, oldState.channel, logger);
        }
      }
    }
  } else {
    logger.info(
      `${newState.member.user.username} ${
        oldState.channel === null ? 'joined' : 'left'
      } channel ${
        oldState.channel.name
      } but slavbot was already playing something`,
      infoLogCtx(
        'voiceStateUpdate',
        newState.member.user,
        undefined,
        oldState.channel != null ? oldState.channel : newState.channel
      )
    );
  }
});

// Detect someone going live on Twitch and play alert sound if they have one set
client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (Object.keys(regUsers).includes(newPresence.user.id.toString())) {
    if (regUsers[newPresence.user.id.toString()].twitchSound != 'none') {
      // Make sure the update is an actual change, is Twitch, and that it's the first update containing twitch
      let oldPresenceNotTwitch = true;
      if (oldPresence !== null) {
        oldPresence.activities.forEach((activity) => {
          if (activity.type === 'STREAMING') {
            oldPresenceNotTwitch = false;
          }
        });
        if (oldPresenceNotTwitch) {
          newPresence.activities.forEach((activity) => {
            if (
              !newPresence.equals(oldPresence) &&
              activity.type === 'STREAMING'
            ) {
              const firstChannel = newPresence.guild.channels.cache
                .filter((channel) => channel.isVoice())
                .first();

              logger.info(
                `${newPresence.user.username} has gone live on ${activity.name}`,
                infoLogCtx(
                  'presenceUpdate',
                  newPresence.user,
                  undefined,
                  undefined
                )
              );

              playSound(
                regUsers[newPresence.user.id.toString()].twitchSound,
                firstChannel,
                logger
              );
            }
          });
        }
      } else {
        logger.warn(
          'oldPresence was null',
          warnLogCtx('presenceUpdate', newPresence.user, undefined, undefined)
        );
      }
    }
  }
});

client.login(TOKEN);

module.exports = { client };

/*
  TO-DO:
  - Fix !create overwriting edited random lists with lists loaded at startup
*/
