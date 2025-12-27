import db from "../src/models/index.js";

const testBookModel = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("DB connected");

    // Create a test book
    const book = await db.Book.create({
      title: "Test 2",
      author: "Olayemi",
      isbn: "1234567891",
      category: "Fiction",
      quantity: 5,
      available: 5,
      published_year: 2023,
    });

    console.log("Book created:", book.toJSON());
  } catch (err) {
    console.error("Error testing Book model:", err);
  } finally {
    await db.sequelize.close();
  }
};

testBookModel();