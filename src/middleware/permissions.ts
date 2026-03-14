import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.js";
import { forbidden } from "../utils/errors.js";

export function requirePermissions(required: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userPerms = req.user?.permissions ?? [];
    const missing = required.filter((perm) => !userPerms.includes(perm));
    if (missing.length) {
      return next(forbidden("Missing permissions"));
    }
    return next();
  };
}
