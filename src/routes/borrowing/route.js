import { Router } from "express";
import { PERMISSIONS } from "../../constants/roles.js";
import { authorize } from "../../middleware/auth.js";

const router = Router();

// Issue Books (Admin/Staff)
router.post("/issue", authorize(PERMISSIONS.ISSUE_BOOKS), (req, res) => {
  res.json({ message: "Issue book - Admin/Staff only" });
});

// Return Books (Admin/Staff)
router.post("/return", authorize(PERMISSIONS.RETURN_BOOKS), (req, res) => {
  res.json({ message: "Return book - Admin/Staff only" });
});

// Borrow Request (Students)
router.post("/request", authorize(PERMISSIONS.BORROW_BOOKS), (req, res) => {
  res.json({ message: "Borrow request - Students only" });
});

// View My Borrowed Books (Students)
router.get("/my-books", authorize(PERMISSIONS.BORROW_BOOKS), (req, res) => {
  res.json({ message: "View my borrowed books - Students only" });
});

// View All Borrowing Records (Admin/Staff)
router.get("/records", authorize(PERMISSIONS.STAFF_LEVEL), (req, res) => {
  res.json({ message: "View borrowing records - Admin/Staff only" });
});

export default router;
