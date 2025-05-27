const Dice = require("./Dice.js");

class DiceParser {
  static parse(args) {
    if (args.length < 3) {
      throw new Error("At least 3 dice are required");
    }

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
    }

    return dice;
  }
}

module.exports = DiceParser;
