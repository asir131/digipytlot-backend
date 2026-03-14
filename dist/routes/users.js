import { Router } from "express";
import { createUserHandler, deleteUserHandler, getAssignablePermissions, getUser, getUserPermissions, listRoles, listUsers, updateUserHandler, } from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/permissions.js";
import { validate } from "../middleware/validate.js";
import { z } from "zod";
import { PermissionKeys } from "../utils/permissionKeys.js";
const router = Router();
const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
const createSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        roleIds: z.array(objectId).default([]),
        permissions: z.array(z.string()).default([]),
        managerId: objectId.nullable().optional(),
    }),
    params: z.object({}),
    query: z.object({}),
});
const updateSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        roleIds: z.array(objectId).optional(),
        permissions: z.array(z.string()).optional(),
        status: z.enum(["active", "suspended", "banned"]).optional(),
        managerId: objectId.nullable().optional(),
    }),
    params: z.object({ id: z.string() }),
    query: z.object({}),
});
router.use(authMiddleware);
router.get("/", requirePermissions([PermissionKeys.usersView]), listUsers);
router.get("/roles", requirePermissions([PermissionKeys.usersView]), listRoles);
router.get("/assignable", requirePermissions([PermissionKeys.usersUpdate]), getAssignablePermissions);
router.get("/:id", requirePermissions([PermissionKeys.usersView]), getUser);
router.get("/:id/permissions", requirePermissions([PermissionKeys.usersView]), getUserPermissions);
router.post("/", requirePermissions([PermissionKeys.usersCreate]), validate(createSchema), createUserHandler);
router.patch("/:id", requirePermissions([PermissionKeys.usersUpdate]), validate(updateSchema), updateUserHandler);
router.delete("/:id", requirePermissions([PermissionKeys.usersDelete]), deleteUserHandler);
export default router;
