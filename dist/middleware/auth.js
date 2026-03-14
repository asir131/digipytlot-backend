import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { unauthorized, forbidden } from "../utils/errors.js";
export async function authMiddleware(req, _res, next) {
    const authHeader = req.headers.authorization;
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const token = bearer ?? req.cookies?.access_token;
    if (!token) {
        return next(unauthorized());
    }
    try {
        const payload = jwt.verify(token, env.jwtSecret);
        req.user = {
            id: payload.sub,
            roleIds: payload.roleIds,
            permissions: payload.permissions,
            status: payload.status,
            tokenVersion: payload.tokenVersion,
        };
        const user = await User.findById(payload.sub).lean();
        if (!user)
            return next(unauthorized());
        if (user.status !== "active")
            return next(forbidden("Account is not active"));
        if (user.tokenVersion !== payload.tokenVersion)
            return next(unauthorized("Session expired"));
        return next();
    }
    catch {
        return next(unauthorized());
    }
}
export async function attachFreshUser(req, _res, next) {
    if (!req.user)
        return next();
    const user = await User.findById(req.user.id).lean();
    if (!user)
        return next(unauthorized());
    if (user.status !== "active")
        return next(forbidden("Account is not active"));
    if (user.tokenVersion !== req.user.tokenVersion)
        return next(unauthorized("Session expired"));
    return next();
}
