const { faker } = require("@faker-js/faker");
const seedFaker = require("./generateSeed");
function generateBooks(seed, page, likesAvg, reviewsAvg, langCode) {
  seedFaker(seed + page, langCode);
  const books = [];
  for (let i = 0; i < 10; i++) {
    const title = faker.lorem.words(faker.datatype.number({ min: 2, max: 6 }));
    const authors = Array.from(
      { length: faker.datatype.number({ min: 1, max: 2 }) },
      () => faker.name.fullName()
    );
    const publisher = faker.company.name();
    const ISBN = faker.datatype.uuid();
    const reviews = Math.random() < reviewsAvg ? [faker.lorem.paragraph()] : [];
    const likes = Math.random() < likesAvg ? Math.ceil(likesAvg) : 0;

    books.push({
      index: page * 10 + i + 1,
      title,
      authors,
      publisher,
      ISBN,
      reviews,
      likes,
    });
  }
  return books;
}

module.exports = generateBooks;
