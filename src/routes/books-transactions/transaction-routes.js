/**
 * BookTransaction Routes
 *
 * Defines API endpoints for the LMS transaction module:
 * - POST /borrow -> borrow a book
 * - POST /return -> return a book
 * - GET / -> list all transactions
 *
 * Author: Hahn Onimus
 * Date: 08-01-2026
 */

import { Router } from "express";
import {
  borrowBook,
  listTransactions,
  returnBook,
} from "./transaction-controller.js";

const router = Router();

// Borrow a book
router.post("/borrow", borrowBook);

// Return a book
router.post("/return", returnBook);

// List all transactions
router.get("/", listTransactions);

export default router;
