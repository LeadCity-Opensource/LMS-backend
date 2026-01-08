/**
 * BookTransaction Controller
 *
 * This module contains the business logic for:
 * - Borrowing a book
 * - Returning a book
 * - Validating transaction states
 * - Auto-detecting overdue books
 *
 * Features:
 * - Prevents borrowing an already borrowed book
 * - Updates status on return
 * - Returns detailed error messages for client clarity
 *
 * Author: Hahn Onimus
 * Date: 08-01-2026
 */

import { Op } from "sequelize";
import { BookTransaction } from "../../models/transaction-model.js";

/**
 * Borrow a book
 * - Checks if the book is already borrowed
 * - Creates a new transaction
 * - Returns the transaction object
 */
export const borrowBook = async (req, res) => {
  const { bookId, borrowerId, dueDate } = req.body;

  // Validate required fields
  if (!bookId || !borrowerId || !dueDate) {
    return res.status(400).json({
      message: "Missing required fields: bookId, borrowerId, dueDate",
    });
  }

  try {
    // Check if the book is already borrowed and not returned
    const existing = await BookTransaction.findOne({
      where: {
        book_id: bookId,
        status: "borrowed",
      },
    });

    if (existing) {
      return res.status(400).json({ message: "Book is already borrowed" });
    }

    // Create new transaction with borrowed status
    const transaction = await BookTransaction.create({
      book_id: bookId,
      borrower_id: borrowerId,
      due_date: dueDate,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Error borrowing book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Return a book
 * - Validates transaction existence
 * - Prevents returning an already returned book
 * - Updates status and returned_at
 */
export const returnBook = async (req, res) => {
  const { transactionId } = req.body;

  // Validate required field
  if (!transactionId) {
    return res.status(400).json({ message: "transactionId is required" });
  }

  try {
    // Fetch transaction
    const transaction = await BookTransaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Prevent double return
    if (transaction.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    // Update status and returned timestamp
    transaction.status = "returned";
    transaction.returned_at = new Date();

    await transaction.save();

    return res.json(transaction);
  } catch (error) {
    console.error("Error returning book:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * List all transactions
 * - Automatically marks overdue transactions
 * - Returns all transactions in descending order of borrowed date
 */

export const listTransactions = async (_req, res) => {
  try {
    // Mark overdue transactions
    const now = new Date();
    await BookTransaction.update(
      { status: "overdue" },
      {
        where: {
          status: "borrowed",
          due_date: { [Op.lt]: now },
        },
      }
    );

    // Fetch all transactions
    const transactions = await BookTransaction.findAll({
      order: [["borrowed_at", "DESC"]],
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Error listing transactions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
