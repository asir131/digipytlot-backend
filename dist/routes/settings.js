import { Router } from "express";
import { getSettings } from "../controllers/settingsController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { PermissionKeys } from "../utils/permissionKeys.js";
const router = Router();
router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.settingsView]), getSettings);
export default router;
