import db from "../../models/index.js";
import AppError from "../../utils/AppError.js";

const { Book } = db;
const { Op } = db.Sequelize;

// Create a new book
export const createBook = async (req, res, next) => {
  const { title, author, isbn, category, quantity, available, published_year } =
    req.body || {};

  if (!title) {
    return next(new AppError("Title is required", 400));
  }

  try {
    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      quantity: quantity || 1,
      available: available || quantity || 1,
      published_year,
    });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

// Get all books
export const getAllBooks = async (_req, res, next) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

// Get a single book by ID
export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// Search books by title or author
export const searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return next(new AppError("Search query is required", 400));
    }

    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

// Update a book
export const updateBook = async (req, res, next) => {
  const { title, author, isbn, category, quantity, available, published_year } =
    req.body || {};

  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    await book.update({
      title: title !== undefined ? title : book.title,
      author: author !== undefined ? author : book.author,
      isbn: isbn !== undefined ? isbn : book.isbn,
      category: category !== undefined ? category : book.category,
      quantity: quantity !== undefined ? quantity : book.quantity,
      available: available !== undefined ? available : book.available,
      published_year:
        published_year !== undefined ? published_year : book.published_year,
    });
    res.status(200).json(book);
  } catch (err) {
    next(err);
  }
};

// Delete a book by ID
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return next(new AppError("Book not found", 404));
    }

    await book.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
