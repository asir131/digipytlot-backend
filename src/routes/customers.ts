import { Router } from "express";
import { listCustomers } from "../controllers/customersController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { PermissionKeys } from "../utils/permissionKeys.js";

const router = Router();

router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.customerPortalView]), listCustomers);

export default router;
