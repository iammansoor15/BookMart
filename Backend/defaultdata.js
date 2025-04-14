const bookSchema = require("./models/bookSchema");
const Books = require("./constants/Books.json");

const DefaultData = async () => {
  try {
    for (const book of Books.books) {
      await bookSchema.updateOne(
        { isbn: book.isbn },
        { $set: book },
        { upsert: true }
      );
    }
    console.log("Books updated or inserted successfully");
  } catch (error) {
    console.log("Data update error: " + error.message);
  }
};

module.exports = DefaultData;