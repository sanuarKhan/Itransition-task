const fs = require("fs");
const { createHash } = require("crypto");

const taskFilesDir = "./taskFiles";
const email = "sanuarkhan220@gmail.com";

// Calculate hashes for all files and sort them
const fileHashes = fs
  .readdirSync(taskFilesDir)
  .map((file) => {
    const data = fs.readFileSync(`${taskFilesDir}/${file}`);
    const hash = createHash("sha3-256");
    return hash.update(data).digest("hex").toLowerCase(); // Apply toLowerCase() here
  })
  .sort()
  .reverse()
  .join("");

// Concatenate file hashes with email and calculate final hash
const combinedString = fileHashes + email;
const finalHash = createHash("sha3-256").update(combinedString).digest("hex");

console.log(finalHash);
