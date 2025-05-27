const readline = require("readline");
const CryptoUtils = require("./CryptoUtiles");

class FairRandomGenerator {
  constructor() {
    this.key = null;
    this.computerNumber = null;
    this.hmac = null;
  }

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
  }

  async getUserInput(min, max) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    while (true) {
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
    }
  }
}
module.exports = FairRandomGenerator;
