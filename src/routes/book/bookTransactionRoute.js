import express from "express";
import {
  createTransaction,
  getAllTransactions,
} from "../controllers/bookTransaction.controller.js";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getAllTransactions);

export default router;
