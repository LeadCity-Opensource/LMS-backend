/**
 * BookTransaction Routes
 *
 * Defines API endpoints for the LMS transaction module:
 * - POST /borrow          → borrow a book
 * - POST /return          → return a book
 * - GET  /                → list all transactions (with overdue auto-update)
 * - GET  /by-date         → get transactions borrowed on a specific date
 * - GET  /by-range        → get transactions borrowed in a date range
 *
 * Author: Hahn Onimus
 * Updated: 25 January 2026
 * route.js
 */

import { Router } from "express";
import {
  borrowBook,
  returnBook,
  listTransactions,
  getTransactionsByDate,
  getTransactionsByDateRange,
} from "../../controllers/books-transactions/controller.js";

const router = Router();

// ────────────────────────────────────────────────
// Core transaction actions
// ────────────────────────────────────────────────

// Borrow a book (single copy, one active borrow per user)
router.post("/borrow", borrowBook);

// Return a book using transaction ID
router.post("/return", returnBook);

// List all transactions (newest first, auto-marks overdue)
router.get("/", listTransactions);

// ────────────────────────────────────────────────
// Date-based transaction queries
// ────────────────────────────────────────────────

// Get transactions borrowed on a specific date
// Example: GET /by-date?date=2026-01-15
router.get("/by-date", getTransactionsByDate);

// Get transactions borrowed within a date range
// Example: GET /by-range?startDate=2026-01-01&endDate=2026-01-15
router.get("/by-range", getTransactionsByDateRange);

export default router;