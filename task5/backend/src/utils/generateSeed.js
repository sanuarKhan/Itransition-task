const { faker } = require("@faker-js/faker");

const SUPPORTED_LANGS = {
  en: {
    locale: "en",
    name: "English (USA)",
  },
  de: {
    locale: "de",
    name: "German (Germany)",
  },
  bn: {
    locale: "bn",
    name: "Bengali (Bangladesh)",
  },
};

function seedFaker(seed, langCode) {
  // if (!SUPPORTED_LANGS[langCode]) {
  //   throw new Error(`Unsupported language code: ${langCode}`);
  // }
  // faker.locale = SUPPORTED_LANGS[langCode].locale;
  faker.seed(seed);
}

module.exports = {
  seedFaker,
  SUPPORTED_LANGS,
};
