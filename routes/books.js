import express from "express";
import { Book } from "../src/models/book.js";


const router = express.Router();

// GET all books
router.get("/", async (_req, res) => {
    try {
        const books = await Book.findAll();
        res.json({ books });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new book
router.post("/", async (req, res) => {
    try {
        const { title, author } = req.body;
        const newBook = await Book.create({ title, author });
        res.json({ message: "Book added!", book: newBook });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update a book by ID
router.put("/:id", async (req, res) => {
    try {
        const { title, author } = req.body;
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (title) book.title = title;
        if (author) book.author = author;
        await book.save();

        res.json({ message: "Book updated!", book });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a book by ID
router.delete("/:id", async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        await book.destroy();
        res.json({ message: "Book deleted!", book });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;


