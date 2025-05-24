const Dice = require("./Dice.js");

class InvalidArgumentsError extends Error {}
class InvalidDiceFormatError extends Error {}
class DiceParser {
  static parseDiceString(argStrings) {
    if (argStrings.length < 3) {
      throw new InvalidArgumentsError(
        "At least 3 arguments are required. Example: '1,2,3,4,5,6', '2,2,4,4,9,9', '3,3,5,5,7,7'"
      );
    }

    const diceArray = [];
    for (let i = 0; i < argStrings.length; i++) {
      const diceStrings = argStrings[i];
      const faceNumbers = diceStrings.split(",").map(Number);
      if (faceNumbers.some(isNaN) || faceNumbers.every(Number.isInteger)) {
        throw new InvalidDiceFormatError(`Invalid dice format: ${diceStrings}`);
      }
      if (faceNumbers.length !== 6) {
        throw new InvalidDiceFormatError(`Invalid dice format: ${diceStrings}`);
      }
      diceArray.push(new Dice(faceNumbers));
    }
    return diceArray;
  }
}

module.exports = {
  DiceParser,
  InvalidArgumentsError,
  InvalidDiceFormatError,
};
