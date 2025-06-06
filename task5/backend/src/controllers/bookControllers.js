const generateBooks = require("../utils/generateBooks");

const getBooks = (req, res) => {
  const { seed, page, likesAvg, reviewsAvg, langCode } = req.query;
  console.log(seed, page, likesAvg, reviewsAvg, langCode);
  try {
    const books = generateBooks(seed, page, likesAvg, reviewsAvg, langCode);
    console.log(books);
    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      data: books,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "error in fetching books", error });
  }
};

module.exports = { getBooks };
