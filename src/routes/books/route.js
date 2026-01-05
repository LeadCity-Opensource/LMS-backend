import { Router } from "express";
import { PERMISSIONS } from "../../constants/roles.js";
import { authorize } from "../../middleware/auth.js";

const router = Router();

// Book Management Routes
router.post("/", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Add book - Admin only" });
});

router.put("/:id", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Update book - Admin only" });
});

router.delete("/:id", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Delete book - Admin only" });
});

router.get("/", authorize(PERMISSIONS.EVERYONE), (_req, res) => {
  res.json({ message: "View books - Everyone" });
});

router.get("/:id", authorize(PERMISSIONS.EVERYONE), (_req, res) => {
  res.json({ message: "View book details - Everyone" });
});

// Borrowing Routes (merged from /api/borrowing)
router.post("/issue", authorize(PERMISSIONS.STAFF_AND_ADMIN), (_req, res) => {
  res.json({ message: "Issue book - Admin/Staff only" });
});

router.post("/return", authorize(PERMISSIONS.STAFF_AND_ADMIN), (_req, res) => {
  res.json({ message: "Return book - Admin/Staff only" });
});

router.post("/request", authorize(PERMISSIONS.EVERYONE), (_req, res) => {
  res.json({ message: "Borrow request - Everyone" });
});

router.get("/my-books", authorize(PERMISSIONS.EVERYONE), (_req, res) => {
  res.json({ message: "View my borrowed books - Everyone" });
});

router.get("/records", authorize(PERMISSIONS.STAFF_AND_ADMIN), (_req, res) => {
  res.json({ message: "View borrowing records - Admin/Staff only" });
});

export default router;
