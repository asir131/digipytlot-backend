import { Router } from "express";
import { createTask, deleteTask, listTasks, updateTask } from "../controllers/tasksController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { PermissionKeys } from "../utils/permissionKeys.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";

const router = Router();

const createSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    status: z.enum(["open", "in_progress", "done", "blocked"]).optional(),
    assigneeId: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    status: z.enum(["open", "in_progress", "done", "blocked"]).optional(),
    assigneeId: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),
  params: z.object({ id: z.string() }),
  query: z.object({}),
});

router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.tasksView]), listTasks);
router.post("/", requirePermissions([PermissionKeys.tasksCreate]), validate(createSchema), createTask);
router.patch("/:id", requirePermissions([PermissionKeys.tasksUpdate]), validate(updateSchema), updateTask);
router.delete("/:id", requirePermissions([PermissionKeys.tasksDelete]), deleteTask);

export default router;
