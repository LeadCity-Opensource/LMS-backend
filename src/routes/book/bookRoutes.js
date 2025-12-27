import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  searchBooks,
  updateBook,
  deleteBook,
} from "../../controllers/book-management/bookController.js";

const router = express.Router();

// Create a new book
router.post("/", createBook);

// Get all books
router.get("/", getAllBooks);

// Search books by author, title, year, category
router.get("/search", searchBooks);

// Get a single book by ID
router.get("/:id", getBookById);

// Update a book by ID
router.patch("/:id", updateBook);

// Delete a book by ID
router.delete("/:id", deleteBook);

export default router;