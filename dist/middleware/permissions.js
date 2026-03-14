import { forbidden } from "../utils/errors.js";
export function requirePermissions(required) {
    return (req, _res, next) => {
        const userPerms = req.user?.permissions ?? [];
        const missing = required.filter((perm) => !userPerms.includes(perm));
        if (missing.length) {
            return next(forbidden("Missing permissions"));
        }
        return next();
    };
}
