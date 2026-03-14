import { Types } from "mongoose";
import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { badRequest, forbidden, notFound } from "../utils/errors.js";
import { mergePermissions } from "../utils/permissions.js";
export async function getEffectivePermissions(userId) {
    const user = await User.findById(userId).lean();
    if (!user)
        throw notFound("User not found");
    const roles = await Role.find({ _id: { $in: user.roleIds } }).lean();
    return mergePermissions(user, roles);
}
export function assertAssignablePermissions(actorPerms, requestedPerms) {
    const missing = requestedPerms.filter((perm) => !actorPerms.includes(perm));
    if (missing.length) {
        throw forbidden("Cannot assign permissions you do not hold");
    }
}
export async function assertAssignableRole(actorPerms, roleIds) {
    const roles = await Role.find({ _id: { $in: roleIds } }).lean();
    const rolePerms = Array.from(new Set(roles.flatMap((r) => r.permissions)));
    assertAssignablePermissions(actorPerms, rolePerms);
}
export async function createUser(data) {
    const existing = await User.findOne({ email: data.email });
    if (existing)
        throw badRequest("Email already in use");
    const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        roleIds: data.roleIds.map((id) => new Types.ObjectId(id)),
        permissions: data.permissions,
        managerId: data.managerId ? new Types.ObjectId(data.managerId) : null,
    });
    return user;
}
export async function updateUser(userId, updates) {
    const user = await User.findById(userId);
    if (!user)
        throw notFound("User not found");
    if (updates.name)
        user.name = updates.name;
    if (updates.email)
        user.email = updates.email;
    if (updates.roleIds)
        user.roleIds = updates.roleIds.map((id) => new Types.ObjectId(id));
    if (updates.permissions)
        user.permissions = updates.permissions;
    if (updates.status)
        user.status = updates.status;
    if (updates.managerId !== undefined) {
        user.managerId = updates.managerId ? new Types.ObjectId(updates.managerId) : null;
    }
    await user.save();
    return user;
}
export async function incrementTokenVersion(userId) {
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
}
