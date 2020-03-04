const dedmoroz = {
  name: 'dedmoroz',
  description:
    'runs a secret santa-like function using reactions to a given message, and DMs all participants with their giftee',
  execute: function(message, args) {
    const msgID = args[0];
    message.channel.messages.fetch(msgID).then(msg => {
      console.log(msg.reactions);
    });
  }
};

module.exports = dedmoroz;
