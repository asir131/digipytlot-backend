import { Router } from "express";
import { getReports } from "../controllers/reportsController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { PermissionKeys } from "../utils/permissionKeys.js";
const router = Router();
router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.reportsView]), getReports);
export default router;
