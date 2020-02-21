// It's slav time
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, TOKEN } = require('./config.json');
const { playSound } = require('./slavsound');

client.once('ready', () => {
  console.log('READY!');
});

// When get message, do thing
client.on('message', async message => {
  // If message author is self, don't do thing
  if (message.author.id === client.user.id) {
    return;
  }

  if (message.content.startsWith(prefix)) {
    playSound(message.content.substring(1), message);
    console.log(message.content.substring(1));
  }
});

client.login(TOKEN);

module.exports = { client };
