import db from "../../models/index.js";
import { sendSuccess, sendError } from "../../helpers/responseHelper.js";

// CREATE book
export const createBook = async (req, res) => {
  try {
    const book = await db.Book.create(req.body);
    return sendSuccess(res, "Book created successfully", book, 201);
  } catch (err) {
    return sendError(res, "Failed to create book", 500, err);
  }
};

// Show all books
export const getAllBooks = async (_req, res) => {
  try {
    const books = await db.Book.findAll();
    return sendSuccess(res, "Books retrieved successfully", books);
  } catch (err) {
    return sendError(res, "Failed to fetch books", 500, err);
  }
};

// Show single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await db.Book.findByPk(req.params.id);
    if (!book) return sendError(res, "Book not found", 404);
    return sendSuccess(res, "Book retrieved", book);
  } catch (err) {
    return sendError(res, "Failed to fetch book", 500, err);
  }
};

// SEARCH books
export const searchBooks = async (req, res) => {
  try {
    const { author, published_year, title, category } = req.query;
    const where = {};

    if (author) where.author = author;
    if (published_year) where.published_year = published_year;
    if (title) where.title = { [db.Sequelize.Op.like]: `%${title}%` };
    if (category) where.category = category;

    const books = await db.Book.findAll({ where });
    return sendSuccess(res, "Search results", books);
  } catch (err) {
    return sendError(res, "Failed to search books", 500, err);
  }
};

// UPDATE book
export const updateBook = async (req, res) => {
  try {
    const book = await db.Book.findByPk(req.params.id);
    if (!book) return sendError(res, "Book not found", 404);

    await book.update(req.body);
    return sendSuccess(res, "Book updated successfully", book);
  } catch (err) {
    return sendError(res, "Failed to update book", 500, err);
  }
};

// DELETE book
export const deleteBook = async (req, res) => {
  try {
    const book = await db.Book.findByPk(req.params.id);
    if (!book) return sendError(res, "Book not found", 404);

    await book.destroy();
    return sendSuccess(res, "Book deleted successfully");
  } catch (err) {
    return sendError(res, "Failed to delete book", 500, err);
  }
};