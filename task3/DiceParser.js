const Dice = require("./Dice.js");

<<<<<<< HEAD
=======
class InvalidArgumentsError extends Error {}
class InvalidDiceFormatError extends Error {}

>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
class DiceParser {
  static parse(args) {
    if (args.length < 3) {
      throw new Error("At least 3 dice are required");
    }

<<<<<<< HEAD
    const dice = [];
    for (let i = 0; i < args.length; i++) {
      try {
        const faces = args[i].split(",").map((face) => {
          const num = parseInt(face.trim());
          if (isNaN(num)) {
            throw new Error(`Invalid face value: ${face}`);
          }
          return num;
        });

        if (faces.length !== 6) {
          throw new Error(
            `Dice ${i + 1} must have exactly 6 faces, got ${faces.length}`
          );
        }

        dice.push(new Dice(faces));
      } catch (error) {
        throw new Error(`Error parsing dice ${i + 1}: ${error.message}`);
      }
=======
    const diceArray = [];
    for (let i = 0; i < argStrings.length; i++) {
      const diceStrings = argStrings[i];
      const faceNumbers = diceStrings.split(",").map(Number);

      // Validate numeric values
      if (faceNumbers.some(isNaN) || !faceNumbers.every(Number.isInteger)) {
        throw new InvalidDiceFormatError(
          `Invalid dice format: ${diceStrings} - all values must be integers`
        );
      }

      // Validate length
      if (faceNumbers.length !== 6) {
        throw new InvalidDiceFormatError(
          `Invalid dice format: ${diceStrings} - must have exactly 6 faces`
        );
      }

      // Validate positive numbers
      if (!faceNumbers.every((n) => n > 0)) {
        throw new InvalidDiceFormatError(
          `Invalid dice format: ${diceStrings} - all values must be positive`
        );
      }

      diceArray.push(new Dice(faceNumbers));
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
    }

    return dice;
  }
}

module.exports = DiceParser;
