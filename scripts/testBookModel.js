import db from "../src/models/index.js";

const testBookModel = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ DB connected");

    // To create a book
    const book = await db.Book.create({
      title: "Test 1",
      author: "Olayemi",
      isbn: "1234567890",
      category: "Academic",
      quantity: 2,
      available: 1,
      published_year: 2025,
    });

    console.log("Book created:", book.toJSON());
  } catch (err) {
    console.error("Error testing Book model:", err);
  } finally {
    await db.sequelize.close();
  }
};

testBookModel();