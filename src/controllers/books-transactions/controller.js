/**
 * BookTransaction Controller
 *
 * Handles borrowing, returning, listing, and date-based querying of book transactions.
 * Supports multiple copies via Book.available field.
 * Enforces one active borrowed book per user at a time.
 *
 * Author: Hahn Onimus
 * Updated: 25 January 2026
 * controller.js
 */

import { Op } from "sequelize";
import { BookTransaction } from "../../models/books-transactions.js";
import { Book } from "../../models/book.js";

// 14 days in milliseconds
const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Borrow a book
 * - Verifies book exists and has available copies > 0
 * - Prevents user from borrowing if they already have an active (borrowed/overdue) book
 * - Creates transaction with due date = now + 14 days
 * - Decrements book's available count
 */
export const borrowBook = async (req, res) => {
  const { bookId, borrowerId } = req.body;

  if (!bookId || !borrowerId) {
    return res.status(400).json({
      message: "Missing required fields: bookId, borrowerId",
    });
  }

  try {
    // 1. Find the book
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.available <= 0) {
      return res.status(400).json({ message: "No copies available to borrow" });
    }

    // 2. Check if user already has any active borrowed or overdue transaction
    const activeTransaction = await BookTransaction.findOne({
      where: {
        borrower_id: borrowerId,
        status: {
          [Op.in]: ["borrowed", "overdue"],
        },
      },
    });

    if (activeTransaction) {
      return res.status(400).json({
        message: "User already has an active borrowed book (only one allowed at a time)",
      });
    }

    // 3. Set due date (2 weeks from now)
    const dueDate = new Date(Date.now() + TWO_WEEKS_MS);

    // 4. Create transaction
    const transaction = await BookTransaction.create({
      book_id: bookId,
      borrower_id: borrowerId,
      due_date: dueDate,
      status: "borrowed",
      // borrowed_at defaults to NOW via model
    });

    // 5. Decrease available copies
    await book.update({
      available: book.available - 1,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Error borrowing book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Return a book
 * - Validates transaction exists and is not already returned
 * - Marks transaction as returned and sets returned_at
 * - Increases book's available count
 */
export const returnBook = async (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ message: "transactionId is required" });
  }

  try {
    // Load transaction + associated book (using the alias defined in Book.associate)
    const transaction = await BookTransaction.findByPk(transactionId, {
      include: [
        {
          model: Book,
          as: "book",           // matches the alias in Book.hasMany(..., as: "transactions")
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "returned") {
      return res.status(400).json({ message: "Book has already been returned" });
    }

    // Update transaction status and timestamp
    transaction.status = "returned";
    transaction.returned_at = new Date();
    await transaction.save();

    // Increase available copies
    if (transaction.book) {
      await transaction.book.update({
        available: transaction.book.available + 1,
      });
    } else {
      // Fallback in case include didn't work (shouldn't happen if association is correct)
      const book = await Book.findByPk(transaction.book_id);
      if (book) {
        await book.update({
          available: book.available + 1,
        });
      }
    }

    return res.json(transaction);
  } catch (error) {
    console.error("Error returning book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * List all transactions
 * - Automatically marks overdue books
 * - Returns newest first
 */
export const listTransactions = async (_req, res) => {
  try {
    const now = new Date();

    // Auto-update overdue status
    await BookTransaction.update(
      { status: "overdue" },
      {
        where: {
          status: "borrowed",
          due_date: { [Op.lt]: now },
        },
      }
    );

    const transactions = await BookTransaction.findAll({
      order: [["borrowed_at", "DESC"]],
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Error listing transactions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get transactions borrowed on a specific date
 * Query: ?date=2026-01-15
 */
export const getTransactionsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      message: "date query parameter is required (YYYY-MM-DD)",
    });
  }

  try {
    const start = new Date(date);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const transactions = await BookTransaction.findAll({
      where: {
        borrowed_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
      order: [["borrowed_at", "DESC"]],
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get transactions borrowed within a date range
 * Query: ?startDate=2026-01-01&endDate=2026-01-15
 */
export const getTransactionsByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Both startDate and endDate are required (YYYY-MM-DD)",
    });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Include full end date
    end.setDate(end.getDate() + 1);

    const transactions = await BookTransaction.findAll({
      where: {
        borrowed_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
      order: [["borrowed_at", "DESC"]],
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions by range:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};