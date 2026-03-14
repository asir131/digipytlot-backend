import { RoleDocument } from "../models/Role.js";
import { UserDocument } from "../models/User.js";

export function mergePermissions(user: UserDocument, roles: RoleDocument[]) {
  const direct = user.permissions ?? [];
  const rolePerms = roles.flatMap((r) => r.permissions);
  return Array.from(new Set([...direct, ...rolePerms]));
}
