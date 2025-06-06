const faker = require("@faker-js/faker");
const SUPPORTED_LANGS = {
  "en-US": "en",
  "de-DE": "de",
  "bn-BD": "bn",
};
function seedFaker(seed, langCode) {
  faker.seed(seed);
  faker.locale = SUPPORTED_LANGS[langCode] || "en";
}

module.exports = seedFaker;
