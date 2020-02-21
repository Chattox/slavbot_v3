const { client } = require('./slavmain.js');

const playSound = async (sound, message) => {
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    const dispatcher = connection.play(`./sounds/${sound}.mp3`);
    dispatcher.on('start', () => {
      message.delete().then(msg => {
        console.log('Deleted command message');
      });
      console.log('playing!');
    });
    dispatcher.on('finish', () => {
      console.log('finished!');
      connection.disconnect();
    });

    dispatcher.on('error', console.error);
  }
};

module.exports = { playSound };
