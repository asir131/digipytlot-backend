import { Router } from "express";
import { createLead, deleteLead, listLeads, updateLead } from "../controllers/leadsController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { PermissionKeys } from "../utils/permissionKeys.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const createSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    status: z.enum(["new", "contacted", "qualified", "won", "lost"]).optional(),
    ownerId: z.string().optional(),
    customerId: z.string().optional(),
    value: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    status: z.enum(["new", "contacted", "qualified", "won", "lost"]).optional(),
    ownerId: z.string().optional(),
    customerId: z.string().optional(),
    value: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}),
});

router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.leadsView]), listLeads);
router.post("/", requirePermissions([PermissionKeys.leadsCreate]), validate(createSchema), createLead);
router.patch("/:id", requirePermissions([PermissionKeys.leadsUpdate]), validate(updateSchema), updateLead);
router.delete("/:id", requirePermissions([PermissionKeys.leadsDelete]), deleteLead);

export default router;
