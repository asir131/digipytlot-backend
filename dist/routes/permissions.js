import { Router } from "express";
import { listPermissions } from "../controllers/permissionsController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { PermissionKeys } from "../utils/permissionKeys.js";
const router = Router();
router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.permissionsView]), listPermissions);
export default router;
