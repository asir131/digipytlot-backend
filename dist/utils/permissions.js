export function mergePermissions(user, roles) {
    const direct = user.permissions ?? [];
    const rolePerms = roles.flatMap((r) => r.permissions);
    return Array.from(new Set([...direct, ...rolePerms]));
}
