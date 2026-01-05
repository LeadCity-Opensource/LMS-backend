import { Router } from "express";
import { PERMISSIONS } from "../../constants/roles.js";
import { authorize } from "../../middleware/auth.js";

const router = Router();

// Manage Fines (Admin only)
router.post("/", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Create fine - Admin only" });
});

router.put("/:id", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Update fine - Admin only" });
});

router.delete("/:id", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "Delete fine - Admin only" });
});

// View All Fines (Admin only)
router.get("/all", authorize(PERMISSIONS.ADMIN_ONLY), (_req, res) => {
  res.json({ message: "View all fines - Admin only" });
});

// View My Fines (Everyone)
router.get("/my-fines", authorize(PERMISSIONS.EVERYONE), (_req, res) => {
  res.json({ message: "View my fines - Everyone" });
});

// Pay Fine (Everyone)
router.post("/:id/pay", authorize(PERMISSIONS.EVERYONE), (_req, res) => {
  res.json({ message: "Pay fine - Everyone" });
});

export default router;
