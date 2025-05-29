const readline = require("readline");
const CryptoUtils = require("./CryptoUtiles");

class FairRandomGenerator {
  constructor() {
    this.key = null;
    this.computerNumber = null;
    this.hmac = null;
  }
<<<<<<< HEAD

  async generateFairRandom(min, max, prompt) {
    // Step 1: Generate computer number and key
    this.computerNumber = CryptoUtils.generateSecureRandom(min, max);
    this.key = CryptoUtils.generateSecureKey();

    // Step 2: Calculate and display HMAC
    this.hmac = CryptoUtils.calculateHMAC(this.key, this.computerNumber);
    console.log(
      `I selected a random value in the range ${min}..${max} (HMAC=${this.hmac}).`
    );
    console.log(prompt);

    // Step 3: Get user input
    const userNumber = await this.getUserInput(min, max);

    // Step 4: Calculate result and reveal key
    const result = (this.computerNumber + userNumber) % (max - min + 1);
    console.log(
      `My number is ${this.computerNumber} (KEY=${this.key
        .toString("hex")
        .toUpperCase()}).`
    );
    console.log(
      `The fair number generation result is ${
        this.computerNumber
      } + ${userNumber} = ${result} (mod ${max - min + 1}).`
    );

    return result;
=======
  getSecureRandomInt(max) {
    let randomInt;
    do {
      const bytes = crypto.randomBytes(4);
      randomInt = bytes.readUInt32BE(0);
    } while (randomInt >= max);
    return randomInt;
  }
  async generateFairRandomNumber(rangeMax, promptMessage) {
    console.log(promptMessage);
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
      `Available moves: ${Array.from({ length: rangeMax }, (_, i) => i).join(
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

    return { result };
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
  }

  async getUserInput(min, max) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
<<<<<<< HEAD
      // Display options
      for (let i = min; i <= max; i++) {
        console.log(`${i} - ${i}`);
      }
      console.log("X - exit");
      console.log("? - help");

      const answer = await new Promise((resolve) => {
        rl.question("Your selection: ", resolve);
      });

      if (answer.toUpperCase() === "X") {
        rl.close();
        process.exit(0);
      }

      if (answer === "?") {
        console.log(
          "Select a number to add to the computer's hidden number for fair random generation."
        );
        continue;
      }

      const num = parseInt(answer);
      if (!isNaN(num) && num >= min && num <= max) {
        rl.close();
        return num;
      }

      console.log("Invalid selection. Please try again.");
=======
      const input = await new Promise((resolve) =>
        rl.question("your move: ", resolve)
      );
      const trimmed = input.trim();
      if (trimmed.toUpperCase() === "X") {
        return "X";
      }
      if (trimmed === "?") {
        return "?";
      }
      const num = parseInt(trimmed);
      if (Number.isInteger(num) && num >= 0 && num < rangeMax) {
        return num;
      }
      console.log(`Invalid input. Enter 0-${rangeMax - 1}, X, or ?.`);
>>>>>>> 9908205f241dee524fbd5245df5b62e5938b8836
    }
  }
}
module.exports = FairRandomGenerator;
