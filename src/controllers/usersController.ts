import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { getPagination } from "../utils/pagination.js";
import { recordAudit } from "../services/auditService.js";
import { hashPassword } from "../utils/password.js";
import {
  assertAssignablePermissions,
  assertAssignableRole,
  createUser,
  getEffectivePermissions,
  updateUser,
  incrementTokenVersion,
} from "../services/userService.js";
import { badRequest, notFound } from "../utils/errors.js";
import { AuthRequest } from "../middleware/auth.js";

export async function listUsers(req: Request, res: Response) {
  const { page, limit, skip } = getPagination(req.query as Record<string, string>);
  const { q, status, roleId, managerId } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];
  if (status) filter.status = status;
  if (roleId) filter.roleIds = roleId;
  if (managerId) filter.managerId = managerId;

  const [items, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).select("-passwordHash").lean(),
    User.countDocuments(filter),
  ]);

  const mapped = items.map((item) => ({ ...item, id: item._id }));

  return res.json({ items: mapped, page, limit, total });
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash").lean();
    if (!user) throw notFound("User not found");
    return res.json({ user: { ...user, id: user._id } });
  } catch (error) {
    return next(error);
  }
}

export async function createUserHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const actorPerms = req.user?.permissions ?? [];
    const body = req.body as {
      name: string;
      email: string;
      password: string;
      roleIds: string[];
      permissions: string[];
      managerId?: string | null;
    };

    if (!body.password || body.password.length < 8) throw badRequest("Password too short");

    await assertAssignableRole(actorPerms, body.roleIds ?? []);
    assertAssignablePermissions(actorPerms, body.permissions ?? []);

    const passwordHash = await hashPassword(body.password);
    const user = await createUser({
      name: body.name,
      email: body.email,
      passwordHash,
      roleIds: body.roleIds ?? [],
      permissions: body.permissions ?? [],
      managerId: body.managerId ?? null,
    });

    await recordAudit(req.user?.id ?? null, "user.create", "user", user.id, {
      roleIds: body.roleIds,
      permissions: body.permissions,
    });

    const safeUser = user.toObject() as any;
    safeUser.id = safeUser._id;
    delete safeUser.passwordHash;
    return res.status(201).json({ user: safeUser });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const actorPerms = req.user?.permissions ?? [];
    const body = req.body as {
      name?: string;
      email?: string;
      roleIds?: string[];
      permissions?: string[];
      status?: "active" | "suspended" | "banned";
      managerId?: string | null;
    };

    if (body.roleIds) await assertAssignableRole(actorPerms, body.roleIds);
    if (body.permissions) assertAssignablePermissions(actorPerms, body.permissions);

    const user = await updateUser(req.params.id, body);

    if (body.status && body.status !== "active") {
      await incrementTokenVersion(user.id);
    }

    await recordAudit(req.user?.id ?? null, "user.update", "user", user.id, body);

    const safeUser = user.toObject() as any;
    safeUser.id = safeUser._id;
    delete safeUser.passwordHash;
    return res.json({ user: safeUser });
  } catch (error) {
    return next(error);
  }
}

export async function deleteUserHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw notFound("User not found");

    await user.deleteOne();
    await recordAudit(req.user?.id ?? null, "user.delete", "user", user.id);
    return res.json({ message: "User deleted" });
  } catch (error) {
    return next(error);
  }
}

export async function getAssignablePermissions(req: AuthRequest, res: Response) {
  const perms = req.user?.permissions ?? [];
  return res.json({ permissions: perms });
}

export async function getUserPermissions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const permissions = await getEffectivePermissions(req.params.id);
    return res.json({ permissions });
  } catch (error) {
    return next(error);
  }
}

export async function listRoles(_req: Request, res: Response) {
  const roles = await Role.find().lean();
  return res.json({ roles });
}
