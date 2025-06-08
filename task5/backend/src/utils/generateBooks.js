// Correct imports
const { fakerRU, fakerZH_CN, fakerBN_BD, fakerEN } = require("@faker-js/faker");
const { seedFaker } = require("./generateSeed");
const coverImage = require("./coverGenerate");

async function generateBooks(
  seed,
  page = 0,
  likesAvg = 0,
  reviewsAvg = 0,
  langCode = "en"
) {
  // Input validation
  if (!seed) throw new Error("Seed is required");
  page = parseInt(page) || 0;
  likesAvg = parseFloat(likesAvg) || 0;
  reviewsAvg = parseFloat(reviewsAvg) || 0;

  seedFaker(seed + page, langCode);

  let faker;

  // Fix faker instantiation
  switch (langCode) {
    case "zh":
      faker = fakerZH_CN;
      break;
    case "ru":
      faker = fakerRU;
      break;
    case "bn":
      faker = fakerBN_BD;
      break;
    default:
      faker = fakerEN;
      break;
  }

  const books = [];
  const BOOKS_PER_PAGE = 20;

  for (let i = 0; i < BOOKS_PER_PAGE; i++) {
    const authorCount = faker.number.int({ min: 1, max: 3 });
    const authors = Array.from({ length: authorCount }, () =>
      faker.person.fullName()
    );

    // Fix review count logic - use normal distribution around average
    const reviewCount =
      reviewsAvg > 0
        ? Math.max(
            0,
            Math.round(
              faker.number.float({
                min: 0,
                max: reviewsAvg * 2,
              })
            )
          )
        : 0;

    const reviews = Array.from({ length: reviewCount }, () => ({
      text: faker.lorem.paragraph(),
      author: faker.person.fullName(),
      date: faker.date.past(),
    }));

    // Fix likes logic - use normal distribution around average
    const likes =
      likesAvg > 0
        ? Math.max(
            0,
            Math.round(
              faker.number.float({
                min: 0,
                max: likesAvg * 2,
              })
            )
          )
        : 0;

    // Handle async cover image generation
    let imageUrl = await coverImage();

    books.push({
      index: page * BOOKS_PER_PAGE + i + 1,
      isbn: `${faker.string.numeric(3)}-${faker.string.numeric(
        1
      )}-${faker.string.numeric(3)}-${faker.string.numeric(
        5
      )}-${faker.string.numeric(1)}`,
      title: faker.book.title(),
      authors,
      publisher: faker.book.publisher(),
      coverImage: imageUrl,
      reviews,
      format: faker.book.format(),
      likes,
      publishDate: faker.date.past(),
      genre: faker.book.genre(),
      pages: faker.number.int({ min: 100, max: 1000 }),
      series: faker.book.series(),
      price: faker.commerce.price(),
    });
  }

  return books;
}

module.exports = generateBooks;
