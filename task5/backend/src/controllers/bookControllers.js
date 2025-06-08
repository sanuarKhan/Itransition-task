const generateBooks = require("../utils/generateBooks");
const { SUPPORTED_LANGS } = require("../utils/generateSeed");

const getBooks = async (req, res) => {
  const {
    seed,
    page = 0,
    likesAvg = 0,
    reviewsAvg = 0,
    langCode = "en",
  } = req.query;

  try {
    if (!seed) {
      return res.status(400).json({
        success: false,
        message: "Seed is required",
      });
    }

    // if (langCode && !SUPPORTED_LANGS[langCode]) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Unsupported language. Available: ${Object.keys(
    //       SUPPORTED_LANGS
    //     ).join(", ")}`,
    //   });
    // }

    const books = await generateBooks(
      seed,
      page,
      likesAvg,
      reviewsAvg,
      langCode
    );

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
      // meta: {
      //   page: parseInt(page),
      //   languages: SUPPORTED_LANGS,
      // },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in fetching books",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = { getBooks };
