const dotenv = require("dotenv");
dotenv.config();
const client_id = process.env.UNSPLASH_API_KEY;
const coverImage = async () => {
  try {
    const res = `https://api.unsplash.com/photos/random?query=book&count=1&client_id=${client_id}`;
    const response = await fetch(res);

    if (!response.ok) {
      // Return a default book cover image
      return `https://loremflickr.com/300/400/book?lock=${Date.now()}`;
    }

    const data = await response.json();
    return data[0].urls.regular;
  } catch (error) {
    console.error("Error fetching cover image:", error);
    // Return a default book cover image
    return "https://i.guim.co.uk/img/media/423d3ddf306e98864c1d887c1dcf290421cd21a7/0_169_4912_6140/master/4912.jpg?width=445&dpr=1&s=none&crop=none";
  }
};

module.exports = coverImage;
