const { loggers } = require('winston');
const { infoLogCtx, errLogCtx } = require('./loggingContextHelpers');

const fs = require('fs').promises;

// Log the pairings of secret santas to a file for reference if something goes wrong
const logSecretSantaPairs = (pairings, giftingDate, message, args, logger) => {
  const day = giftingDate.getDate();
  const month = giftingDate.getMonth() + 1;
  const year = giftingDate.getFullYear();
  const pairStringsArray = pairings.map((pair) => pair.join(' -> '));
  const logString =
    `Secret Slavbot ${year} pairings: \n\n` + pairStringsArray.join('\n');
  const logFilename = `secret-slavbot-pairings-${year}-${month}-${day}`;

  const logInfo = [
    'util function',
    message.author,
    'logSecretSantaPairs',
    message.channel,
    args,
  ];

  fs.writeFile(
    __dirname + `/../secretSlavbotPairings/${logFilename}.txt`,
    logString,
    'utf8'
  )
    .then((res) =>
      logger.info(`${logFilename}.txt written`, infoLogCtx(...logInfo))
    )
    .catch((err) =>
      logger.error(
        `Error writing to ${logFilename}.txt`,
        errLogCtx(...logInfo, err)
      )
    );
};

module.exports = { logSecretSantaPairs };
