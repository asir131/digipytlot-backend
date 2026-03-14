import { Router } from "express";
import { listAuditLogs } from "../controllers/auditController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { PermissionKeys } from "../utils/permissionKeys.js";
const router = Router();
router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.auditView]), listAuditLogs);
export default router;
