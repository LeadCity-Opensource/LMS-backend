import db from "../../models/index.js";

export const createTransaction = async (req, res) => {
  try {
    const transaction = await db.BookTransaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTransactions = async (_req, res) => {
  try {
    const transactions = await db.BookTransaction.findAll({
      include: [
        db.Book,
        { model: db.User, as: "borrower" },
        { model: db.User, as: "librarian" },
      ],
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
