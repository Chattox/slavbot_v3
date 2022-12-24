const fs = require('fs').promises;

// Log the pairings of secret santas to a file for reference if something goes wrong
const logSecretSantaPairs = (pairings, giftingDate) => {
  const day = giftingDate.getDate();
  const month = giftingDate.getMonth() + 1;
  const year = giftingDate.getFullYear();
  const pairStringsArray = pairings.map((pair) => pair.join(' -> '));
  const logString =
    `Secret Slavbot ${year} pairings: \n\n` + pairStringsArray.join('\n');
  const logFilename = `secret-slavbot-pairings-${year}-${month}-${day}`;

  fs.writeFile(
    __dirname + `/../secretSlavbotPairings/${logFilename}.txt`,
    logString,
    'utf8'
  )
    .then((res) => console.log(`${logFilename}.txt written!`))
    .catch((err) => console.log(err));
};

module.exports = { logSecretSantaPairs };
