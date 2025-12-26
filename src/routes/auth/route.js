import { Router } from "express";
import {
  login,
  signup,
  updatePassword,
} from "../../controllers/auth/controller.js";
import { protect } from "../../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-password", protect, updatePassword);

export default router;
