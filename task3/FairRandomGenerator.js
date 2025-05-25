const crypto = require("crypto");

class FairRandomGenerator {
  constructor(cryptoUtils, rl) {
    this.cryptoUtils = cryptoUtils;
    this.rl = rl;
  }
  getSecureRandomInt(max) {
    let randomInt;
    do {
      const bytes = crypto.randomBytes(4);
      randomInt = bytes.readUInt32BE(0);
    } while (randomInt >= max);
    return randomInt;
  }
  async generateFairRandomNumber(rangeMax, promptMessage) {
    console.log(promptMessage,);
    //computer's choice
    const computerChoice = this.getSecureRandomInt(rangeMax);
    const secretKey = this.cryptoUtils.generateSecureRandomBytes(32);
    const hmacDigest = this.cryptoUtils.calculateHmac(
      secretKey,
      String(computerChoice)
    );
    console.log(
      `I selected a random value in the range 0..${
        rangeMax - 1
      } (HMAC=${hmacDigest}).`
    );
    console.log("Now it is your turn to guess the value.");
    console.log(
      `Availabe moves: ${Array.from({ length: rangeMax }, (_, i) => i).join(
        ", "
      )}, X(exit), ? (help)`
    );

    //user's choice
    const userInput = await this.getUserInput(rangeMax);
    if (userInput === "X") return { exit: true };
    if (userInput === "?") return { help: true };

    //reveal and calculate
    const result = (computerChoice + userInput) % rangeMax;
    console.log(
      `my selection: ${computerChoice} (KEY=${secretKey.toString("hex")})`
    );
    console.log(
      `the fair number generation is ${computerChoice} + ${userInput} = ${result} (mod ${rangeMax})`
    );

    return {
      result,
      secretKey: secretKey.toString("hex"),
      computerValue: computerChoice,
    };
  }
  async getUserInput(rangeMax) {
    const rl = this.rl;
    while (true) {
      const input = await new Promise((resolve) =>
        rl.question("your move:", resolve)
      );
      const trimmed = input.trim();
      if (trimmed.toUpperCase() === "X") {
        rl.close();
        return "X";
      }
      if (trimmed === "?") {
        rl.close();
        return "?";
      }
      const num = parseInt(trimmed);
      if (Number.isInteger(num) && num >= 0 && num < rangeMax) {
        rl.close();
        return num;
      }
      console.log(`Invakid input. Enter 0-${rangeMax - 1}, X, or ?.`);
    }
  }
}
module.exports = FairRandomGenerator;
