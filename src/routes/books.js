const express = require("express");
const router = express.Router();
const books = require("../data/books");

router.get("/", (req, res) => res.json(books));

router.get("/category/:category", (req, res) => {
  const category = req.params.category;
  const filtered = books.filter(b => b.category.toLowerCase() === category.toLowerCase());
  res.json(filtered);
});

module.exports = router;
