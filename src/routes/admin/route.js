import { Router } from "express";
import { PERMISSIONS } from "../../constants/roles.js";
import { createAdminOrStaff } from "../../controllers/user-management/controller.js";
import { authorize } from "../../middleware/auth.js";

const router = Router();

router.post(
  "/create-user",
  authorize(PERMISSIONS.ADMIN_ONLY),
  createAdminOrStaff
);

export default router;
