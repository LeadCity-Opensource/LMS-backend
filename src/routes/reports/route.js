import { Router } from "express";
import { PERMISSIONS } from "../../constants/roles.js";
import { authorize } from "../../middleware/auth.js";

const router = Router();

// View Reports (Admin only)
router.get("/", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "View reports - Admin only" });
});

// Generate Reports (Admin only)
router.post("/generate", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Generate report - Admin only" });
});

// Book Usage Report
router.get("/books-usage", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Book usage report - Admin only" });
});

// User Activity Report
router.get("/user-activity", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "User activity report - Admin only" });
});

// Overdue Books Report
router.get("/overdue", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Overdue books report - Admin only" });
});

export default router;
